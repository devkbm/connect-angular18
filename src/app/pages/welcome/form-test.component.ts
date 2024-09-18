import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-form-test',
  standalone: true,
  imports: [
    CommonModule, FormsModule,  ReactiveFormsModule,
    NzGridModule, NzFormModule, NzInputModule
  ],
  template: `
    <form nz-form [formGroup]="fg" nzLayout="vertical">
    <div nz-row nzGutter="8">
      <div nz-col nzSpan="8">
        <nz-form-item>
          <nz-form-label nzFor="email">E-mail</nz-form-label>
          <nz-form-control>
            <input nz-input name="email" type="email" id="email" />
          </nz-form-control>
        </nz-form-item>
      </div>

      <div nz-col nzSpan="8">
        <nz-form-item>
          <nz-form-label nzFor="email2">E-mail2</nz-form-label>
          <nz-form-control>
            <input nz-input name="email2" type="email2" id="email2" />
          </nz-form-control>
        </nz-form-item>
      </div>
    </div>


    </form>
  `,
  styles: `
  `
})
export class FormTestComponent {
  fg: FormGroup = inject(FormBuilder).group({
    input_text: ['test', [ Validators.required ]]
  });
}
