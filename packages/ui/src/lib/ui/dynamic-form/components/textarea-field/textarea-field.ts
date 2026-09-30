import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';

@Component({
  selector: 'lib-textarea-field',
  imports: [FormField],
  template: `
  <div class="flex flex-col gap-1 w-full">
    <label class="text-sm font-medium text-gray-700" [for]="field().key">{{ field().label }}{{ field().required ? ' *' : '' }}</label>
    <textarea
      [rows]="field().rows ?? 4"
      [placeholder]="field().placeholder ?? ''"
      [formField]="control()"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
    ></textarea>
  </div>
  `,
})
export class TextareaField {
  field = input.required<Extract<FieldConfig, { type: 'textarea' }>>();
  control = input.required<FieldTree<string>>();
}
