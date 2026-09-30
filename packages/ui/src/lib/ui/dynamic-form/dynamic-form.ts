import { NgComponentOutlet } from '@angular/common';
import {
  Component, computed, effect, input, output, signal,
  Injector, inject, runInInjectionContext, untracked
} from '@angular/core';
import { form, required, readonly, FieldTree } from '@angular/forms/signals';
import { FIELD_COMPONENTS } from '../../constant/field-registry';
import { FieldConfig, FileUploadFn } from '../../models/field-types';
import { forkJoin, map, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-dynamic-form',
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm {
  private injector = inject(Injector);
  private translate = inject(TranslateService);
  private modelInitialized = signal(false);
  private lastFieldKeys = signal<string | null>(null);
  private userFormInstance: FieldTree<Record<string, any>> | null = null;
private inputsCache = new Map<string, { field: FieldConfig; control: any }>();
private lastGroupedFieldsKeys: string | null = null;

  fields = input<FieldConfig[]>([]);
  mode = input<'create' | 'update'>('create');
  submitLabelInput = input<string | null>(null);
  formSubmit = output<Record<string, any> | FormData>();
  valueChanges = output<Record<string, any>>();
  initialData = input<Record<string, any> | null>(null);
  uploadFn = input<FileUploadFn>();
  submitLabel = input<string>('Add');
  isSubmitting = signal(false);

  FIELD_COMPONENTS = FIELD_COMPONENTS;

  groupedFields = computed(() => {
  const currentMode = this.mode();

    const visibleFields = this.fields().filter(
      f => !f.hiddenIn?.includes(currentMode)
    );

    const groups = new Map<number, FieldConfig[]>();
    visibleFields.forEach((field, index) => {
      const row = field.row ?? index;
      if (!groups.has(row)) groups.set(row, []);
      groups.get(row)!.push(field);
    });
    return Array.from(groups.values());
});

  private modelSignal = signal<Record<string, any>>({});
  constructor() {
     effect(() => {
      const defaults = Object.fromEntries(
          this.fields().map(f => [f.key, f.type === 'checkbox' ? false : ''])
      );
        const data = this.initialData();
      this.modelSignal.set(data ? { ...defaults, ...data } : defaults);
    });

    effect(() => {
      this.valueChanges.emit(this.modelSignal());
    });

    effect(() => {
      const model = this.modelSignal();
      const computedFields = this.fields().filter(f => f.computedFrom);
      if (!computedFields.length) return;

      const updates: Record<string, number> = {};
      computedFields.forEach(field => {
        const [key1, key2] = field.computedFrom!.fields;
        const val1 = Number(model[key1]) || 0;
        const val2 = Number(model[key2]) || 0;
        const result = field.computedFrom!.formula(val1, val2);
        if (model[field.key] !== result) {
          updates[field.key] = result;
        }
      });

      if (Object.keys(updates).length) {
        this.modelSignal.update(m => ({ ...m, ...updates }));
      }
    });
  }

  userForm = computed(() => {
    const currentFields = this.fields();
    const data = this.initialData();

    return untracked(() => {
      const currentKeys = currentFields.map(f => f.key).sort().join(',');
      const structureChanged = currentKeys !== this.lastFieldKeys();

      if (!this.modelInitialized() || structureChanged) {
        const defaults = Object.fromEntries(
          currentFields.map(f => [f.key, f.type === 'checkbox' ? false : ''])
        );
        if (!this.modelInitialized()) {
          this.modelSignal.set(data ? { ...defaults, ...data } : defaults);
        }
        this.modelInitialized.set(true);
        this.lastFieldKeys.set(currentKeys);
      }

      if (this.userFormInstance && !structureChanged) {
        return this.userFormInstance;
      }

      this.userFormInstance = runInInjectionContext(this.injector, () =>
        form(this.modelSignal, (path) => {
          currentFields.forEach((field) => {
            required(path[field.key], {
              when: () => {
                const target = this.fields().find((f) => f.key === field.key);
                return !!target?.required;
              },
              message: () =>
                this.translate.instant('form.requiredMessage', { label: field.label }),
            });

            readonly(path[field.key], () => {
              const target = this.fields().find((f) => f.key === field.key);
              return !!target?.readonly;
            });
          });
        })
      );

      return this.userFormInstance;
    });
  });

  uploadedFiles = computed(() => {
    const files: Record<string, any> = {};
    this.fields()
      .filter(f => f.type === 'upload')
      .forEach(f => (files[f.key] = this.modelSignal()[f.key]));
    return files;
  });

getInputs(field: FieldConfig) {
    return { field, control: this.userForm()[field.key] };
  }

  onSubmit(e: Event) {
    e.preventDefault();

    if (this.userForm()().invalid()) {
      this.userForm()().markAsTouched();
      return;
    }
    const allowedKeys = this.fields().map(f => f.key);
    const excludedKeys = this.fields()
      .filter(f => f.excludeFromSubmit)
      .map(f => f.key);

    const model: Record<string, any> = {};
    allowedKeys.forEach(key => {
      if (!excludedKeys.includes(key)) {
        model[key] = this.modelSignal()[key];
      }
    });

    this.fields().forEach(field => {
      if (field.type === 'number' && !excludedKeys.includes(field.key) && field.key in model) {
        const val = model[field.key];
        model[field.key] = val === '' || val === null ? null : Number(val);
      }
    });

    const uploadFields = this.fields().filter(f => f.type === 'upload');
    const upload = this.uploadFn();

    if (!uploadFields.length || !upload) {
      this.formSubmit.emit(model);
      return;
    }

    this.isSubmitting.set(true);

    const uploads$ = uploadFields.map(field => {
      const value = model[field.key];

      if (
        typeof value === 'string' ||
        (Array.isArray(value) && value.every(v => typeof v === 'string'))
      ) {
        return of([field.key, value] as const);
      }

      const files: File[] = Array.isArray(value)
        ? value.filter((v): v is File => v instanceof File)
        : (value instanceof File ? [value] : []);

      if (!files.length) {
        return of([field.key, field.multiple ? [] : null] as const);
      }

      return forkJoin(files.map(f => upload(f))).pipe(
        map(urls => [field.key, field.multiple ? urls : urls[0]] as const)
      );
    });

    forkJoin(uploads$).subscribe({
      next: (results) => {
        results.forEach(([key, url]) => (model[key] = url));
        this.formSubmit.emit(model);
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false),
    });
  }
}