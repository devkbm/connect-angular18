import { CommonModule } from '@angular/common';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzFormModule } from 'ng-zorro-antd/form';

import { Component, OnInit, AfterViewInit, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DeptService } from './dept.service';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { existingDeptValidator } from './dept-duplication-validator.directive';

import { ResponseObject } from 'src/app/core/model/response-object';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { Dept } from './dept.model';
import { DeptHierarchy } from './dept-hierarchy.model';
import { ResponseList } from 'src/app/core/model/response-list';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';


@Component({
  selector: 'app-dept-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule, NzTreeSelectModule,
    NzInputTextComponent, NzInputTextareaComponent, NzInputNumberCustomComponent,
    NzInputDateComponent
  ],
  template: `
    {{fg.getRawValue()| json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
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
          <nz-form-item class="form-item">
            <nz-form-label
                nzFor="parentDeptCode"
                [nzXs]="defaultLabelSize.xs" [nzSm]="defaultLabelSize.sm">
                상위 부서코드
            </nz-form-label>

            <nz-form-control [nzXs]="defaultControlSize.xs" [nzSm]="defaultControlSize.sm" >
                <nz-tree-select
                    id="parentDeptCode"
                    [nzNodes]="deptHierarchy"
                    [nzAllowClear]="true"
                    [nzPlaceHolder]="'상위 부서 없음'"
                    formControlName="parentDeptCode">
                </nz-tree-select>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text #deptCode
            formControlName="deptCode" itemId="deptCode"
            placeholder="부서코드를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">부서코드
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="deptNameKorean" itemId="deptNameKorean"
            placeholder="부서코드명(한글)을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">부서코드명(한글)
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="deptAbbreviationKorean" itemId="deptAbbreviationKorean"
            placeholder="부서코드명(한글) 약어를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">부서코드명(한글) 약어
          </app-nz-input-text>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="deptNameEnglish" itemId="deptNameEnglish"
            placeholder="부서코드명(영문)을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">부서코드명(영문)
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="deptAbbreviationEnglish" itemId="deptAbbreviationEnglish"
            placeholder="부서코드명(영문) 약어를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">부서코드명(영문) 약어
          </app-nz-input-text>
        </div>
      </div>

      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-date
            formControlName="fromDate" itemId="fromDate"
            [required]="true" [nzErrorTip]="errorTpl">시작일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-date
            formControlName="toDate" itemId="toDate"
            [required]="true" [nzErrorTip]="errorTpl">종료일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-number-custom
            formControlName="seq" itemId="seq"
            [required]="true"
            [nzErrorTip]="errorTpl">출력 순번
          </app-nz-input-number-custom>
        </div>
      </div>

      <!-- 5 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="설명을 입력해주세요."
            [rows]="7"
            [required]="false" [nzErrorTip]="errorTpl">설명
          </app-nz-input-textarea>
        </div>
      </div>

    </form>

    <!--<div class="footer">
        <button
            nz-button
            (click)="closeForm()">
            <span nz-icon type="form" nzTheme="outline"></span>
            닫기
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button
            nz-button
            nzType="primary"
            nz-popconfirm
            nzTitle="저장하시겠습니까?"
            (nzOnConfirm)="submitCommonCode()"
            (nzOnCancel)="false">
            <span nz-icon type="save" nzTheme="outline"></span>
            저장
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button
            nz-button
            nzDanger
            nz-popconfirm
            nzTitle="삭제하시겠습니까?"
            (nzOnConfirm)="deleteCommonCode()"
            (nzOnCancel)="false">
            <span nz-icon type="delete" nzTheme="outline"></span>
            삭제
        </button>

    </div>
    -->

  `,
  styles: [`
    [nz-button] {
      margin-right: 8px;
    }

    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    }

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
export class DeptFormComponent extends FormBase implements OnInit, AfterViewInit {

  deptCode = viewChild.required<NzInputTextComponent>('deptCode');

  deptHierarchy: DeptHierarchy[] = [];

  private fb = inject(FormBuilder);
  private service = inject(DeptService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    parentDeptCode          : new FormControl<string | null>(null),
    /*deptId                  : new FormControl<string | null>(null, {
                                validators: Validators.required,
                                asyncValidators: [existingDeptValidator(this.service)],
                                updateOn: 'blur'
                              }),*/
    deptCode                : new FormControl<string | null>(null),
    deptNameKorean          : new FormControl<string | null>(null, { validators: [Validators.required] }),
    deptAbbreviationKorean  : new FormControl<string | null>(null),
    deptNameEnglish         : new FormControl<string | null>(null, { validators: [Validators.required] }),
    deptAbbreviationEnglish : new FormControl<string | null>(null),
    fromDate                : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    toDate                  : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    seq                     : new FormControl<number | null>(1, { validators: [Validators.required] }),
    comment                 : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.getDeptHierarchy();
    this.newForm();
  }

  ngAfterViewInit(): void {
    this.deptCode().focus();
  }

  newForm(): void {
    this.formType = FormType.NEW;

    this.fg.reset();
    //this.fg.controls.deptId.setAsyncValidators(existingDeptValidator(this.service));
    this.fg.controls.deptCode.enable();

    this.fg.controls.deptCode.valueChanges.subscribe(value => {
      if (value === null) return;
      const companyCode = sessionStorage.getItem('companyCode');
      //this.fg.controls.deptId.setValue(companyCode + value);
    });

    /*
    this.fg.patchValue({
      fromDate: dateFns.format(new Date(), "yyyy-MM-dd"),
      toDate: dateFns.format(new Date(9999,11,31), "yyyy-MM-dd"),
      seq: 1
    });
    */

    this.deptCode().focus();
  }

  modifyForm(formData: Dept): void {
    this.formType = FormType.MODIFY;

    this.getDeptHierarchy();

    //this.fg.get('deptId')?.setAsyncValidators(null);
    this.fg.controls.deptCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    this.service
        .getDept(id)
        .subscribe(
            (model: ResponseObject<Dept>) => {
              if ( model.total > 0 ) {
                this.modifyForm(model.data);
              } else {
                this.getDeptHierarchy();
                this.newForm();
              }
              this.appAlarmService.changeMessage(model.message);
            }
        );
  }

  save(): void {
    if (this.fg.invalid) {
      this.checkForm()
      return;
    }

    this.service
        .saveDept(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<Dept>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .deleteDept(this.fg.controls.deptCode.value!)
        .subscribe(
            (model: ResponseObject<Dept>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
            }
        );
  }

  getDeptHierarchy(): void {
    this.service
        .getDeptHierarchyList()
        .subscribe(
          (model: ResponseList<DeptHierarchy>) => {
            if ( model.total > 0 ) {
              this.deptHierarchy = model.data;
            } else {
              this.deptHierarchy = [];
            }
          }
        );
  }

}
