import { Component, inject, input } from '@angular/core';
import { FormField ,FieldTree } from '@angular/forms/signals';
import { SelectModule } from 'primeng/select';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
import {  TranslatePipe, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'lib-select-field',
  imports: [FormField, SelectModule , TranslatePipe],
  template: `
  <div class="flex flex-col gap-1 w-full" [class.untouched]="!control()().touched()">
  <label class="text-sm font-medium text-gray-700" [for]="field().key">{{ field().label }}{{ field().required ? ' *' : '' }}</label>

<p-select
  [dir]="translate.currentLang() === 'ar' ? 'rtl' : 'ltr'"
  [inputId]="field().key"
  [formField]="$any(control())"
  [options]="field().options"
  optionLabel="label"
  optionValue="value"
  [placeholder]="'form.selectPlaceholder' | translate" />

  @if (control()().touched() && control()().invalid()) {
    <span class="text-red-600 text-xs">
      {{ control()().errors()[0]?.message }}
    </span>
  }
</div>`
})
export class SelectField {
   translate = inject(TranslateService);
  field = input.required<Extract<FieldConfig, { type: 'select' }>>();
  control = input.required<FieldTree<string>>();
}
