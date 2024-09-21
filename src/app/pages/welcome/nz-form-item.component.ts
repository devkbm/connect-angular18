import { Component, input, TemplateRef } from '@angular/core';

import { AbstractControl, FormControl, FormControlName, FormsModule, NgModel } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-nz-form-item',
  standalone: true,
  imports: [FormsModule, NzFormModule],
  template: `
    <nz-form-item>
      <nz-form-label [nzFor]="for()" [nzRequired]="required()">
        {{label()}}
      </nz-form-label>
      <ng-content></ng-content>
    </nz-form-item>
  `,
  styles: `
  `
})
export class NzFormItemComponent {

  for = input<string>('');
  label = input<string>('');
  required = input<boolean | string>(false);

}
