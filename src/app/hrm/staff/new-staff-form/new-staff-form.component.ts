import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputRregnoComponent } from 'src/app/shared-component/nz-input-rregno/nz-input-rregno.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';

import { Component, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { StaffService } from '../staff.service';
import { NewStaff } from './new-staff-form.model';



@Component({
  selector: 'app-new-staff-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    NzInputTextComponent, NzInputRregnoComponent, NzCrudButtonGroupComponent
  ],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.valid}}
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

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text #staffNo
            formControlName="staffNo" itemId="staffNo"
            placeholder="직원번호를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="name" itemId="name"
            placeholder="직원명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-rregno
            formControlName="residentRegistrationNumber" itemId="residentRegistrationNumber"
            placeholder="주민등록번호를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">주민등록번호
          </app-nz-input-rregno>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()">
      </app-nz-crud-button-group>
    </div>
  `,
  styles: [`
    .footer {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      padding: 10px 16px;
      border-top: 1px solid rgb(232, 232, 232);
      text-align: right;
      /*background-color: black;*/
    }
  `]
})
export class NewStaffFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  staffNo = viewChild.required<NzInputTextComponent>('staffNo');

  private fb = inject(FormBuilder);
  private service = inject(StaffService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    staffNo                     : new FormControl<string | null>(null, { validators: Validators.required }),
    name                        : new FormControl<string | null>(null, { validators: Validators.required }),
    residentRegistrationNumber  : new FormControl<string | null>(null, { validators: Validators.required }),
    nameEng                     : new FormControl<string | null>(null),
    nameChi                     : new FormControl<string | null>(null)
  });

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.newForm('');
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm(id: String) {
    this.formType = FormType.NEW;

    this.staffNo().focus();
  }

  /*
  modifyForm(formData: DataDomain) {
    this.formType = FormType.MODIFY;

    this.fg.get('database')?.disable();
    this.fg.get('domainName')?.disable();

    this.fg.patchValue(formData);
  }
  */

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  save() {
    this.service
        .newStaff(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<NewStaff>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

}
