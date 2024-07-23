import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { DutyDateListComponent } from './duty-date-list.component';
import { NzInputSelectStaffComponent } from 'src/app/shared-component/nz-input-select-staff/nz-input-select-staff.component';

import { formatDate } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HrmCode } from '../hrm-code/hrm-code.model';
import { HrmCodeService } from '../hrm-code/hrm-code.service';
import { DutyDate, DutyApplication } from './duty-application.model';
import { DutyApplicationService } from './duty-application.service';
import { DutyCodeService } from './duty-code.service';


@Component({
  selector: 'app-duty-application-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzFormModule, NzDividerModule, NzInputTextComponent, NzInputSelectComponent, NzInputDateComponent, NzCrudButtonGroupComponent,
    DutyDateListComponent, NzInputSelectStaffComponent
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
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
        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="dutyId" itemId="dutyId"
            placeholder=""
            [required]="false" [nzErrorTip]="errorTpl">근태신청ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-select-staff
            formControlName="staffId" itemId="staffId"
            placeholder="비고를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">직원
          </app-nz-input-select-staff>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <!--
          <app-nz-input-text
            formControlName="dutyCode" itemId="dutyCode"
            placeholder=""
            [required]="false" [nzErrorTip]="errorTpl">근태코드
          </app-nz-input-text>
          -->

          <app-nz-input-select
            formControlName="dutyCode" itemId="dutyCode"
            [options]="dutyCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
            [placeholder]="'Please select'"
            [nzErrorTip]="errorTpl" [required]="true">근태코드
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="dutyReason" itemId="dutyReason"
            placeholder="근태사유를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">근태사유
          </app-nz-input-text>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-date
            formControlName="fromDate" itemId="fromDate"
            [required]="true" [nzErrorTip]="errorTpl">근태 시작일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-date
            formControlName="toDate" itemId="toDate"
            [required]="true" [nzErrorTip]="errorTpl">근태 종료일
          </app-nz-input-date>
        </div>
      </div>

      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-duty-date-list [data]="this.fg.get('selectedDate')?.value!" [height]="'100px'">
          </app-duty-date-list>
        </div>
      </div>
    </form>


    <app-nz-crud-button-group
      [isSavePopupConfirm]="false"
      [deleteVisible]="true"
      (searchClick)="get(fg.value.dutyId!)"
      (saveClick)="save()"
      (deleteClick)="remove()"
      (closeClick)="closeForm()">
    </app-nz-crud-button-group>

    <div class="footer">
    </div>


  `,
  styles: [`
    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }
  `]
})
export class DutyApplicationFormComponent extends FormBase  implements OnInit {

  /**
   * 근태신청분류 - HR1001
   */
  dutyCodeList: HrmCode[] = [];

  private fb = inject(FormBuilder);
  private service = inject(DutyApplicationService);
  private hrmCodeService = inject(HrmCodeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    dutyId            : new FormControl<string | null>(null, { validators: Validators.required }),
    staffId           : new FormControl<string | null>(null, { validators: Validators.required }),
    dutyCode          : new FormControl<string | null>(null),
    dutyReason        : new FormControl<string | null>(null),
    fromDate          : new FormControl<string | null>(null),
    toDate            : new FormControl<string | null>(null),
    selectedDate      : new FormControl<DutyDate[] | null>(null),
    dutyTime          : new FormControl<number | null>(null)
  });

  ngOnInit() {
    this.getDutyCodeList();
    this.newForm();
  }

  newForm() {
    this.formType = FormType.NEW;

    this.fg.reset();
    this.fg.controls.staffId.enable();
    this.fg.patchValue({
      fromDate: formatDate(new Date(),'YYYY-MM-dd','ko-kr'),
      toDate: formatDate(new Date(),'YYYY-MM-dd','ko-kr'),
      dutyTime: 8
    });

    this.fg.get('fromDate')?.valueChanges.subscribe(x => {
      if (x) this.getDutyDateList(x, formatDate(this.fg.value.toDate!,'YYYY-MM-dd','ko-kr'));
    });
    this.fg.get('toDate')?.valueChanges.subscribe(x => {
      if (x) this.getDutyDateList(formatDate(this.fg.value.fromDate!,'YYYY-MM-dd','ko-kr'), x);
    });
    this.getDutyDateList(formatDate(this.fg.value.fromDate!,'YYYY-MM-dd','ko-kr'), formatDate(this.fg.value.fromDate!,'YYYY-MM-dd','ko-kr'));
  }

  modifyForm(formData: DutyApplication) {
    this.formType = FormType.MODIFY;

    this.fg.patchValue(formData);
    this.fg.get('staffId')?.disable();
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<DutyApplication>) => {
            if ( model.total > 0 ) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  save() {
    console.log('save');
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<DutyApplication>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove() {
    this.service
        .remove(this.fg.value.dutyId!)
        .subscribe(
          (model: ResponseObject<DutyApplication>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getDutyCodeList() {
    const params = {
      typeId : 'HR1001'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            if ( model.total > 0 ) {
              this.dutyCodeList = model.data;
            } else {
              this.dutyCodeList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  getDutyDateList(fromDate: string, toDate: string) {
    this.service
        .getDutyDateList(fromDate, toDate)
        .subscribe(
          (model: ResponseList<DutyDate>) => {
            console.log(model.data);
            this.fg.get('selectedDate')?.setValue(model.data);
            //this.dutyCodeList = model.data;
          }
        )
  }

}
