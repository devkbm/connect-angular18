import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputTreeSelectComponent } from 'src/app/shared-component/nz-input-tree-select/nz-input-tree-select.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';


import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { CommonCodeService } from './common-code.service';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { CommonCode } from './common-code.model';
import { CommonCodeHierarchy } from './common-code-hierarchy.model';
import { ResponseList } from 'src/app/core/model/response-list';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { SystemTypeEnum } from './system-type-enum.model';


@Component({
  selector: 'app-common-code-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzFormModule, NzInputModule, NzInputNumberModule, NzInputDateComponent,
    NzInputTextComponent, NzInputTextareaComponent, NzInputTreeSelectComponent,
    NzInputSelectComponent, NzInputNumberCustomComponent
  ],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.get('fixedLengthYn')?.value}}
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

        <!--시스템구분코드 필드-->
        <div nz-col nzSpan="4">
          <app-nz-input-select
            formControlName="systemTypeCode" itemId="systemTypeCode"
            [options]="systemTypeCodeList" [opt_value]="'value'" [opt_label]="'label'"
            [placeholder]="'Please select'"
            [nzErrorTip]="errorTpl" [required]="true">시스템구분코드
          </app-nz-input-select>
        </div>

        <!--상위 공통코드 필드-->
        <div nz-col nzSpan="8">
          <app-nz-input-tree-select
            formControlName="parentId"
            [nodes]="nodeItems"
            [placeholder]="'Please select'" [nzErrorTip]="errorTpl" [required]="false">상위 공통코드
          </app-nz-input-tree-select>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="code" itemId="code"
            placeholder="코드를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">코드
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="codeName" itemId="codeName"
            placeholder="코드명 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">코드명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="codeNameAbbreviation" itemId="codeNameAbbreviation"
            placeholder="코드약어를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">코드약어
          </app-nz-input-text>
        </div>

      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="5">
          <!--시작일 필드-->
          <app-nz-input-date
            formControlName="fromDate" itemId="fromDate"
            [required]="true" [nzErrorTip]="errorTpl">시작일
          </app-nz-input-date>
        </div>
        <div nz-col nzSpan="5">
          <!--종료일 필드-->
          <app-nz-input-date
            formControlName="toDate" itemId="toDate"
            [required]="true" [nzErrorTip]="errorTpl">종료일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="5">
        <app-nz-input-number-custom
            formControlName="seq" itemId="seq"
            [required]="true"
            [nzErrorTip]="errorTpl">출력 순번
          </app-nz-input-number-custom>
        </div>

        <div nz-col nzSpan="5">
        <app-nz-input-number-custom
            formControlName="lowLevelCodeLength" itemId="lowLevelCodeLength"
            [required]="false"
            [nzErrorTip]="errorTpl">하위 코드 길이
          </app-nz-input-number-custom>
        </div>
      </div>

      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="cmt" itemId="cmt"
            placeholder="비고를 입력해주세요."
            [rows]="13"
            [required]="false" [nzErrorTip]="errorTpl">비고
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

    .form-item {
      margin-top: 0px;
      margin-bottom: 5px;
    }

    .btn-group {
      padding: 6px;
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
export class CommonCodeFormComponent extends FormBase implements OnInit {

  nodeItems: CommonCodeHierarchy[] = [];
  systemTypeCodeList: SystemTypeEnum[] = [];

  private fb = inject(FormBuilder);
  private commonCodeService = inject(CommonCodeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    systemTypeCode          : new FormControl<string | null>(null),
    codeId                  : new FormControl<string | null>(null),
    parentId                : new FormControl<string | null>(null),
    code                    : new FormControl<string | null>(null, { validators: [Validators.required] }),
    codeName                : new FormControl<string | null>(null, { validators: [Validators.required] }),
    codeNameAbbreviation    : new FormControl<string | null>(null),
    fromDate                : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    toDate                  : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    hierarchyLevel          : new FormControl<number | null>(null),
    seq                     : new FormControl<number | null>(null),
    lowLevelCodeLength      : new FormControl<number | null>(null),
    cmt                     : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.getCommonCodeHierarchy('');
    this.getSystemTypeCode();
  }

  newForm(systemTypeCode: string, parentId: any): void {
    this.formType = FormType.NEW;
    this.fg.reset();

    this.fg.get('codeId')?.disable();
    this.fg.get('code')?.enable();
    this.fg.get('systemTypeCode')?.enable();
    this.fg.get('systemTypeCode')?.setValue(systemTypeCode);
    this.fg.get('parentId')?.setValue(parentId);
    this.fg.get('seq')?.setValue(1);
    this.fg.get('lowLevelCodeLength')?.setValue(0);
    this.fg.get('fromDate')?.setValue(new Date());
    this.fg.get('toDate')?.setValue(new Date(9999, 11, 31));
  }

  modifyForm(formData: CommonCode): void {
    this.formType = FormType.MODIFY;

    this.fg.get('codeId')?.disable();
    this.fg.get('code')?.disable();
    this.fg.get('systemTypeCode')?.disable();
    this.fg.get('parentId')?.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(systemTypeCode: string, codeId: string): void {
    this.commonCodeService
        .getCode(systemTypeCode, codeId)
        .subscribe(
          (model: ResponseObject<CommonCode>) => {
            if ( model.total > 0 ) {
              this.modifyForm(model.data);
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

    this.commonCodeService
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<CommonCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.commonCodeService
        .remove(this.fg.controls.systemTypeCode.value!, this.fg.controls.codeId.value!)
        .subscribe(
          (model: ResponseObject<CommonCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getSystemTypeCode(): void {
    this.commonCodeService
      .getSystemTypeList()
      .subscribe(
        (model: ResponseList<SystemTypeEnum>) => {
          this.systemTypeCodeList = model.data;
        }
      );
  }

  getCommonCodeHierarchy(systemTypeCode: string): void {
    const params = {
      systemTypeCode: systemTypeCode
    };

    this.commonCodeService
        .getCodeHierarchy(params)
        .subscribe(
          (model: ResponseList<CommonCodeHierarchy>) => {
            if ( model.total > 0 ) {
              this.nodeItems = model.data;
            } else {
              this.nodeItems = new Array<CommonCodeHierarchy>(0);
            }
          }
        );
  }

}
