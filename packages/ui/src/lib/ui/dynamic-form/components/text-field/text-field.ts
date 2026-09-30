import { Component, input } from '@angular/core';
import {  FieldTree, FormField } from '@angular/forms/signals';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';

@Component({
  selector: 'lib-text-field',
  imports: [FormField, InputTextModule, InputNumberModule, DatePickerModule],
  templateUrl: './text-field.html'
})
export class TextField {
  field = input.required<Extract<FieldConfig, { type: 'text' | 'email' | 'number' | 'date' }>>();
  control = input.required<FieldTree<string | number | Date>>();
}
