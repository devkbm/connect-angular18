import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';

import { Component, OnInit, Input, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HrmCode } from '../../hrm-code/hrm-code.model';
import { HrmCodeService } from '../../hrm-code/hrm-code.service';
import { StaffDutyResponsibility } from './staff-duty-responsibility.model';
import { StaffDutyResponsibilityService } from './staff-duty-responsibility.service';
import { NzFormInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-form-input-select.component';
import { NzFormInputCheckboxComponent } from 'src/app/shared-component/nz-input-checkbox/nz-form-input-checkbox.component';

@Component({
  selector: 'app-staff-duty-responsibility-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputTextComponent,
    NzFormInputSelectComponent,
    NzInputDateComponent,
    NzFormInputCheckboxComponent,
    NzCrudButtonGroupComponent
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="staffNo" itemId="duty_staffNo"
            placeholder="직원번호를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="staffName" itemId="duty_staffName"
            placeholder="직원명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원명
          </app-nz-input-text>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="4">
          <app-nz-input-text
            formControlName="seq" itemId="seq"
            placeholder=""
            [required]="true" [nzErrorTip]="errorTpl">순번
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-form-input-select
            formControlName="dutyResponsibilityCode" itemId="dutyResponsibilityCode"
            [options]="dutyResponsibilityCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
            [placeholder]="'Please select'"
            [nzErrorTip]="errorTpl" [required]="true">직책
          </app-nz-form-input-select>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-date
            formControlName="fromDate" itemId="fromDate"
            [required]="true" [nzErrorTip]="errorTpl">시작일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-date
            formControlName="toDate" itemId="toDate"
            [required]="false" [nzErrorTip]="errorTpl">종료일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="2">
          <app-nz-form-input-checkbox
            formControlName="isPayApply"
            checkboxText="Y"
            [required]="false">급여적용
          </app-nz-form-input-checkbox>
        </div>

      </div>
    </form>



    <div class="footer">
      <app-nz-crud-button-group
        (searchClick)="get(fg.controls.staffNo.value!, fg.controls.seq.value!)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="true">
      </app-nz-crud-button-group>
    </div>

  `,
  styles: [`
    [nz-button] {
      margin-right: 8px;
    }

    .form-item {
      margin-top: 0px;
      margin-bottom: 5px;
    }

    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    }

    .footer {
      position: absolute;
      bottom: 50px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }

  `]
})
export class StaffDutyResponsibilityFormComponent extends FormBase implements OnInit, AfterViewInit {

  @Input() staff?: {companyCode: string, staffNo: string, staffName: string};

  /**
   * 직책코드 - HR0007
   */
  dutyResponsibilityCodeList: HrmCode[] = [];

  service = inject(StaffDutyResponsibilityService);
  hrmCodeService = inject(HrmCodeService);
  appAlarmService = inject(AppAlarmService);

  override fg = inject(FormBuilder).group({
      staffNo                 : new FormControl<string | null>(null, { validators: Validators.required }),
      staffName               : new FormControl<string | null>(null),
      seq                     : new FormControl<string | null>({value: null, disabled: true}, { validators: [Validators.required] }),
      dutyResponsibilityCode  : new FormControl<string | null>(null),
      dutyResponsibilityName  : new FormControl<string | null>(null),
      fromDate                : new FormControl<Date | null>(null),
      toDate                  : new FormControl<Date | null>(null),
      isPayApply              : new FormControl<boolean | null>(null)
    });

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.getHrmTypeDetailCodeList('HR0007', "dutyResponsibilityCodeList");
  }

  ngAfterViewInit(): void {
    if (this.initLoadId && this.initLoadId.staffId && this.initLoadId.seq) {
      this.get(this.initLoadId.staffId, this.initLoadId.seq);
    } else {
      this.newForm();
    }
  }


  newForm(): void {
    this.formType = FormType.NEW;

    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff?.staffNo);
      this.fg.controls.staffName.setValue(this.staff?.staffName);
    }
  }

  modifyForm(formData: StaffDutyResponsibility): void {
    this.formType = FormType.MODIFY;

    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();
    this.fg.controls.seq.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    this.service
        .get(staffId, seq)
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            if (model.total > 0) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save(): void {
    if (this.fg.invalid) {
      this.checkForm();
      return;
    }

    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(typeCode: string, detailCode: string): void {
    /*
    this.service
        .delete(typeCode, detailCode)
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
    */
  }


  getHrmTypeDetailCodeList(typeId: string, propertyName: string): void {
    const params = {
      typeId : typeId
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            if ( model.total > 0 ) {
              this.dutyResponsibilityCodeList = model.data;
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );

  }
}
