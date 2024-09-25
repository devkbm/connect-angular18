import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { FormBase } from 'src/app/core/form/form-base';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzFormModule, NzInputModule, NzInputTextComponent, NzInputDateComponent
  ],
  template: `
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
        </div>

      </div>



    </form>
  `,
  styles: `
  `
})
export class CompanyFormComponent extends FormBase {

}
