import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { StaffSchoolCareer } from './staff-school-career.model';
import { ResponseList } from 'src/app/core/model/response-list';
import { HrmCode } from '../../hrm-code/hrm-code.model';
import { HrmCodeService } from '../../hrm-code/hrm-code.service';
import { StaffSchoolCareerService } from './staff-school-career.service';

@Component({
  selector: 'app-staff-school-career-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    NzInputTextComponent, NzInputTextareaComponent, NzInputSelectComponent,
    NzInputNumberCustomComponent, NzInputDateComponent, NzCrudButtonGroupComponent
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

      <!-- 1 Row -->
      <!--
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text #staffId
            formControlName="staffId" itemId="contact_staffId"
            placeholder="직원ID를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="staffNo" itemId="contact_staffNo"
            placeholder="직원번호를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="staffName" itemId="contact_staffName"
            placeholder="직원명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원명
          </app-nz-input-text>
        </div>
      </div>
      -->

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <app-nz-input-select
            formControlName="schoolCareerType" itemId="schoolCareerType"
            [options]="schoolCareerTypeList" [opt_value]="'code'" [opt_label]="'codeName'"
            [placeholder]="'Please select'"
            [nzErrorTip]="errorTpl" [required]="true">학력
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-select
            formControlName="schoolCode" itemId="schoolCode"
            [options]="schoolCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
            [placeholder]="'Please select'"
            [nzErrorTip]="errorTpl" [required]="true">학교
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-date
            formControlName="fromDate" itemId="fromDate"
            [required]="false" [nzErrorTip]="errorTpl">시작일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-date
            formControlName="toDate" itemId="toDate"
            [required]="false" [nzErrorTip]="errorTpl">종료일
          </app-nz-input-date>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="majorName" itemId="majorName"
            placeholder="전공을 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">전공
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="pluralMajorName" itemId="pluralMajorName"
            placeholder="부전공을 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">부전공
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="location" itemId="location"
            placeholder="지역을 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">지역
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-number-custom
            formControlName="lessonYear" itemId="lessonYear"
            [required]="false" [nzErrorTip]="errorTpl">수업년한
          </app-nz-input-number-custom>
        </div>
      </div>

      <!-- 4 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="비고를 입력해주세요."
            [rows]="23"
            [required]="false" [nzErrorTip]="errorTpl">비고
          </app-nz-input-textarea>
        </div>
      </div>

    </form>


    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="true"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(fg.controls.staffNo.value!, fg.controls.seq.value!)">
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
      bottom: 10px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }

  `]
})
export class StaffSchoolCareerFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  @Input() staff?: {companyCode: string, staffNo: string, staffName: string};

  /**
   * 학력 - HR0009
   */
  schoolCareerTypeList: HrmCode[] = [];
  /**
   * 학교 - HR0010
   */
  schoolCodeList: HrmCode[] = [];

  private fb = inject(FormBuilder);
  private service = inject(StaffSchoolCareerService);
  private hrmCodeService = inject(HrmCodeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    staffNo             : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName           : new FormControl<string | null>(null, { validators: Validators.required }),
    seq                 : new FormControl<string | null>(null),
    schoolCareerType    : new FormControl<string | null>(null, { validators: Validators.required }),
    schoolCode          : new FormControl<string | null>(null, { validators: Validators.required }),
    fromDate            : new FormControl<Date | null>(null, { validators: Validators.required }),
    toDate              : new FormControl<Date | null>(null),
    majorName           : new FormControl<string | null>(null),
    pluralMajorName     : new FormControl<string | null>(null),
    location            : new FormControl<string | null>(null),
    lessonYear          : new FormControl<number | null>(null),
    comment             : new FormControl<string | null>(null)
  });

  ngOnInit() {
    this.getSchoolCareerTypeList();
    this.getSchoolCodeList();

    if (this.initLoadId) {
      this.get(this.initLoadId.staffId, this.initLoadId.seq);
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm() {
    this.formType = FormType.NEW;

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff?.staffNo);
      this.fg.controls.staffName.setValue(this.staff?.staffName);
    }
  }


  modifyForm(formData: StaffSchoolCareer) {
    this.formType = FormType.MODIFY;

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff?.staffNo);
      this.fg.controls.staffName.setValue(this.staff?.staffName);
    }

    //this.fg.get('database')?.disable();
    //this.fg.get('domainName')?.disable();

    this.fg.patchValue(formData);
  }


  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    this.service
        .get(staffId, seq)
        .subscribe(
          (model: ResponseObject<StaffSchoolCareer>) => {
            if (model.total > 0) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save() {
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<StaffSchoolCareer>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove(staffId: string, seq: string): void {
    this.service
        .delete(staffId, seq)
        .subscribe(
          (model: ResponseObject<StaffSchoolCareer>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  getSchoolCareerTypeList() {
    const params = {
      typeId : 'HR0009'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            if ( model.total > 0 ) {
              this.schoolCareerTypeList = model.data;
            } else {
              this.schoolCareerTypeList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  getSchoolCodeList() {
    const params = {
      typeId : 'HR0010'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            if ( model.total > 0 ) {
              this.schoolCodeList = model.data;
            } else {
              this.schoolCodeList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

}
