import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzInputCheckboxComponent } from 'src/app/shared-component/nz-input-checkbox/nz-input-checkbox.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';

import { Component, OnInit, Output, EventEmitter, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HrmCodeService } from './hrm-code.service';
import { HrmCode } from './hrm-code.model';
import { existingHrmTypeDetailCodeValidator } from './hrm-code-duplication-validator';




@Component({
  selector: 'app-hrm-code-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzFormModule, NzDividerModule, NzInputTextComponent, NzInputTextareaComponent,
    NzInputSelectComponent, NzInputDateComponent, NzInputNumberCustomComponent, NzCrudButtonGroupComponent,
    NzInputCheckboxComponent
  ],
  template: `
    {{fg.getRawValue() | json}}
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
        <div nz-col nzSpan="4">
          <app-nz-input-text
            formControlName="typeId" itemId="typeId"
            placeholder=""
            [required]="true" [nzErrorTip]="errorTpl">구분ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="4">
          <app-nz-input-text
            formControlName="code" itemId="code"
            placeholder="코드를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">코드
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="10">
          <app-nz-input-text
            formControlName="codeName" itemId="codeName"
            placeholder="코드명를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">코드명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="4">
          <app-nz-input-number-custom
            formControlName="sequence" itemId="sequence"
            [required]="true" [nzErrorTip]="errorTpl">출력 순번
          </app-nz-input-number-custom>
        </div>

        <div nz-col nzSpan="2">
          <app-nz-input-checkbox
            formControlName="useYn"
            checkboxText=""
            [required]="true">사용
          </app-nz-input-checkbox>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="설명을 입력해주세요."
            [rows] = "10"
            [required]="false" [nzErrorTip]="errorTpl">설명
          </app-nz-input-textarea>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the1AddInfo" itemId="the1AddInfo"
            placeholder="설명을 입력해주세요."
            [rows] = "5"
            [required]="false" [nzErrorTip]="errorTpl">추가정보1
          </app-nz-input-textarea>
        </div>
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the2AddInfo" itemId="the2AddInfo"
            placeholder="설명을 입력해주세요."
            [rows] = "5"
            [required]="false" [nzErrorTip]="errorTpl">추가정보2
          </app-nz-input-textarea>
        </div>
      </div>

      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the3AddInfo" itemId="the3AddInfo"
            placeholder="설명을 입력해주세요."
            [rows] = "5"
            [required]="false" [nzErrorTip]="errorTpl">추가정보3
          </app-nz-input-textarea>
        </div>
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the4AddInfo" itemId="the4AddInfo"
            placeholder="설명을 입력해주세요."
            [rows] = "5"
            [required]="false" [nzErrorTip]="errorTpl">추가정보4
          </app-nz-input-textarea>
        </div>
      </div>

      <!-- 5 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the5AddInfo" itemId="the5AddInfo"
            placeholder="설명을 입력해주세요."
            [rows] = "5"
            [required]="false" [nzErrorTip]="errorTpl">추가정보5
          </app-nz-input-textarea>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(this.fg.controls.typeId.value!, this.fg.controls.code.value!)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
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
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      background: black;
    }

  `]
})
export class HrmTypeCodeFormComponent extends FormBase implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  private service = inject(HrmCodeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    typeId        : new FormControl<string | null>(null, { validators: Validators.required }),
    code          : new FormControl<string | null>(null, {
                                    validators: Validators.required,
                                    asyncValidators: [existingHrmTypeDetailCodeValidator(this.service)],
                                    updateOn: 'blur'
                                  }),
    codeName      : new FormControl<string | null>(null, { validators: Validators.required }),
    useYn         : new FormControl<boolean | null>(true),
    sequence      : new FormControl<number | null>(0),
    comment       : new FormControl<string | null>(null),
    the1AddInfo   : new FormControl<string | null>(null),
    the2AddInfo   : new FormControl<string | null>(null),
    the3AddInfo   : new FormControl<string | null>(null),
    the4AddInfo   : new FormControl<string | null>(null),
    the5AddInfo   : new FormControl<string | null>(null)
  });

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    if (this.initLoadId && this.initLoadId.typeId && this.initLoadId.code) {
      this.get(this.initLoadId.typeId, this.initLoadId.code);
    } else if (this.initLoadId && this.initLoadId.typeId){
      this.newForm(this.initLoadId.typeId);
    }
  }

  newForm(typeId: string): void {
    this.formType = FormType.NEW;

    this.fg.get('typeId')?.setValue(typeId);
    this.fg.get('useYn')?.setValue(true);

    this.fg.get('typeId')?.disable();
    this.fg.get('code')?.enable();
  }

  modifyForm(formData: HrmCode): void {
    this.formType = FormType.MODIFY;

    this.fg.patchValue(formData);

    this.fg.get('code')?.disable();
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  select(param: any) {
    this.get(param.value['typeId'], param.value['code']);
  }

  get(typeId: string, code: string): void {
    this.service
        .get(typeId, code)
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            if ( model.total > 0 ) {
              this.modifyForm(model.data);
            } else {
              this.newForm('');
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  save(): void {
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .remove(this.fg.controls.typeId.value!, this.fg.controls.code.value!)
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

}

