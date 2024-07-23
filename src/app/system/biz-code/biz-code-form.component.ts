import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzInputCheckboxComponent } from 'src/app/shared-component/nz-input-checkbox/nz-input-checkbox.component';

import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { FormBase, FormType } from 'src/app/core/form/form-base';

import { ResponseObject } from 'src/app/core/model/response-object';

import { BizCodeService } from './biz-code.service';
import { BizCode } from './biz-code.model';
import { NzFormModule } from 'ng-zorro-antd/form';




@Component({
  selector: 'app-biz-code-form',
  standalone: true,
  imports:  [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    NzInputTextComponent, NzInputTextareaComponent, NzInputNumberCustomComponent,
    NzInputCheckboxComponent, NzCrudButtonGroupComponent
  ],
  template: `
    {{fg.getRawValue() | json}}
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
            formControlName="typeId" itemId="typeId"
            placeholder=""
            [required]="true" [nzErrorTip]="errorTpl">업무코드분류ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="code" itemId="code"
            [required]="true"
            [nzErrorTip]="errorTpl">코드
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="codeName" itemId="codeName"
            [required]="true"
            [nzErrorTip]="errorTpl">코드명
          </app-nz-input-text>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <!--사용여부 필드-->
          <app-nz-input-checkbox
            formControlName="useYn"
            checkboxText="사용여부"
            [required]="true">사용여부
          </app-nz-input-checkbox>
        </div>

        <div nz-col nzSpan="12">
          <!--순번 필드-->
          <app-nz-input-number-custom
            formControlName="sequence" itemId="sequence"
            [required]="true"
            [nzErrorTip]="errorTpl">순번
          </app-nz-input-number-custom>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <!--비고 필드-->
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="비고를 입력해주세요."
            [rows]="20"
            [required]="false" [nzErrorTip]="errorTpl">비고
          </app-nz-input-textarea>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [searchVisible]="false"
        [isSavePopupConfirm]="false"
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
      /*background: #fff;*/
    }

  `]
})
export class BizCodeFormComponent extends FormBase implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  private service = inject(BizCodeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    typeId      : new FormControl<string | null>(null, { validators: [Validators.required] }),
    code        : new FormControl<string | null>(null, { validators: [Validators.required] }),
    codeName    : new FormControl<string | null>(null),
    useYn       : new FormControl<boolean | null>(null),
    sequence    : new FormControl<number | null>(null),
    comment     : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.initLoadId && this.initLoadId.typeId && this.initLoadId.code) {
      this.get(this.initLoadId.typeId, this.initLoadId.code);
    } else if (this.initLoadId && this.initLoadId.typeId) {
      this.newForm(this.initLoadId.typeId);
    }
  }

  newForm(typeId: string): void {
    this.formType = FormType.NEW;

    this.fg.controls.typeId.setValue(typeId);
    this.fg.controls.code.enable();
    this.fg.controls.useYn.setValue(true);
  }

  modifyForm(formData: BizCode): void {
    this.formType = FormType.MODIFY;

    this.fg.controls.code.disable();
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(typeId: string, code: string): void {
    this.service
        .get(typeId, code)
        .subscribe(
          (model: ResponseObject<BizCode>) => {
            if (model.total > 0) {
              this.modifyForm(model.data);
            } else {
              this.newForm('');
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
          (model: ResponseObject<BizCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    this.service
        .delete(this.fg.controls.typeId.value!, this.fg.controls.code.value!)
        .subscribe(
          (model: ResponseObject<BizCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

}
