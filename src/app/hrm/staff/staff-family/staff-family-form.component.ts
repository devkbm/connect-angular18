import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { StaffFamilyService } from './staff-family.service';
import { StaffFamily } from './staff-family.model';
import { HrmCodeService } from '../../hrm-code/hrm-code.service';
import { HrmCode } from '../../hrm-code/hrm-code.model';
import { ResponseList } from 'src/app/core/model/response-list';

@Component({
  selector: 'app-staff-family-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    NzInputTextComponent, NzInputSelectComponent, NzInputTextareaComponent, NzCrudButtonGroupComponent
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
        <div nz-col nzSpan="8">
          <app-nz-input-select
            formControlName="familyRelation" itemId="familyRelation"
            [options]="familyRelationList" [opt_value]="'code'" [opt_label]="'codeName'"
            [placeholder]="'Please select'"
            [nzErrorTip]="errorTpl" [required]="true">가족관계
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="familyName" itemId="familyName"
            placeholder="가족명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">가족명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="familyRRN" itemId="familyRRN"
            placeholder="가족 주민번호를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">주민등록번호
          </app-nz-input-text>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="occupation" itemId="occupation"
            placeholder="직업을 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">직업
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="schoolCareerType" itemId="schoolCareerType"
            placeholder="학력을 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">학력
          </app-nz-input-text>
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
export class StaffFamilyFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  @Input() staff?: {companyCode: string, staffNo: string, staffName: string};

  /**
   * 가족관계 - HR0008
   */
  familyRelationList: HrmCode[] = [];

  service = inject(StaffFamilyService);
  hrmCodeService = inject(HrmCodeService);
  appAlarmService = inject(AppAlarmService);
  fb = inject(FormBuilder);

  override fg = this.fb.group({
    staffNo             : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName           : new FormControl<string | null>(null, { validators: Validators.required }),
    seq                 : new FormControl<string | null>(null),
    familyName          : new FormControl<string | null>(null, { validators: Validators.required }),
    familyRRN           : new FormControl<string | null>(null, { validators: Validators.required }),
    familyRelation      : new FormControl<string | null>(null, { validators: Validators.required }),
    occupation          : new FormControl<string | null>(null),
    schoolCareerType    : new FormControl<string | null>(null),
    comment             : new FormControl<string | null>(null)
  });

  constructor() {
    super();
  }

  ngOnInit() {
    this.getFamilyRelationList();

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

    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff?.staffNo);
      this.fg.controls.staffName.setValue(this.staff?.staffName);
    }
  }


  modifyForm(formData: StaffFamily) {
    this.formType = FormType.MODIFY;

    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff?.staffNo);
      this.fg.controls.staffName.setValue(this.staff?.staffName);
    }

    this.fg.patchValue(formData);
  }


  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    this.service
        .get(staffId, seq)
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
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
          (model: ResponseObject<StaffFamily>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove(staffId: string, seq: string): void {
    this.service
        .delete(staffId, seq)
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  getFamilyRelationList() {
    const params = {
      typeId : 'HR0008'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            if ( model.total > 0 ) {
              this.familyRelationList = model.data;
            } else {
              this.familyRelationList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

}
