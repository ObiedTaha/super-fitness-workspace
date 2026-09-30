import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-form-page',
  imports: [],
  template: `
    <div class="min-h-screen p-6 font-sans">
      <div class="mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ title() }}</h1>

        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `

})
export class FormPage {
  title = input.required<string>();
}
