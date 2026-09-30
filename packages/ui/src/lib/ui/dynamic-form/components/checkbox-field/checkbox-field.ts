import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'lib-checkbox-field',
  imports: [FormField, CheckboxModule],
 template: `
 <div class="flex flex-col gap-1 w-full">
  <p-checkbox [formField]="control()" [binary]="true" [inputId]="field().key" />
  <label class="text-sm font-medium text-gray-700" [for]="field().key">{{ field().label }}</label>
</div>
`
})
export class CheckboxField {
   field = input.required<Extract<FieldConfig, { type: 'checkbox' }>>();
  control = input.required<FieldTree<boolean>>();
}
