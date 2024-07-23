import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import ko from '@angular/common/locales/ko';
registerLocaleData(ko);
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ko_KR } from 'ng-zorro-antd/i18n';
import { DutyDateListComponent } from './duty-date-list.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzButtonsComponent } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
import { NzInputCheckboxComponent } from 'src/app/shared-component/nz-input-checkbox/nz-input-checkbox.component';
import { NzInputCkeditorComponent } from 'src/app/shared-component/nz-input-ckeditor/nz-input-ckeditor.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputDateTimeComponent } from 'src/app/shared-component/nz-input-datetime/nz-input-datetime.component';
import { NzInputDeptSelectComponent } from 'src/app/shared-component/nz-input-dept-select/nz-input-dept-select.component';
import { NzInputMobileComponent } from 'src/app/shared-component/nz-input-mobile/nz-input-mobile.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzInputRadioGroupComponent } from 'src/app/shared-component/nz-input-radio-group/nz-input-radio-group.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputTreeSelectComponent } from 'src/app/shared-component/nz-input-tree-select/nz-input-tree-select.component';
import { NzInputSimpleColorPickerComponent } from 'src/app/shared-component/nz-input-color-picker/nz-input-simple-color-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    WelcomeRoutingModule,
    NzInputTextComponent,
    NzInputTextareaComponent,
    NzButtonsComponent,
    NzInputCheckboxComponent,
    NzInputCkeditorComponent,
    NzInputDateComponent,
    NzInputDateTimeComponent,
    NzInputDeptSelectComponent,
    NzInputMobileComponent,
    NzInputNumberCustomComponent,
    NzInputRadioGroupComponent,
    NzInputSelectComponent,
    NzInputTreeSelectComponent,
    NzInputSimpleColorPickerComponent
  ],
  declarations: [
    WelcomeComponent,
    DutyDateListComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: ko_KR }
  ],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
