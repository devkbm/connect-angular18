import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';

import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { FormBase, FormType } from 'src/app/core/form/form-base';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { BizCodeType } from './biz-code-type.model';
import { BizCodeTypeService } from './biz-code-type.service';
import { SelectControlModel } from 'src/app/core/model/select-control.model.ts';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-biz-code-type-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    NzInputTextComponent, NzInputTextareaComponent, NzInputNumberCustomComponent, NzCrudButtonGroupComponent, NzInputSelectComponent
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
            formControlName="typeId" itemId="typeId"
            placeholder=""
            [required]="true" [nzErrorTip]="errorTpl">코드분류ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="typeName" itemId="typeName"
            [required]="true" [nzErrorTip]="errorTpl">코드분류명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-number-custom
            formControlName="sequence" itemId="sequence"
            [required]="true"
            [nzErrorTip]="errorTpl">순번
          </app-nz-input-number-custom>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-select
            formControlName="bizType"
            [itemId]="'bizType'"
            [options]="bizTypeList" [opt_value]="'value'" [opt_label]="'label'"
            [placeholder]="'Please select'" [nzErrorTip]="errorTpl" [required]="true">시스템
          </app-nz-input-select>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="비고를 입력해주세요."
            [rows]="24"
            [required]="false" [nzErrorTip]="errorTpl">비고
          </app-nz-input-textarea>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(fg.controls.typeId.value!)"
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
export class BizCodeTypeFormComponent extends FormBase implements OnInit, AfterViewInit {

  bizTypeList: SelectControlModel[] = [];

  private fb = inject(FormBuilder);
  private service = inject(BizCodeTypeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    typeId    : new FormControl<string | null>(null, { validators: [Validators.required] }),
    typeName  : new FormControl<string | null>(null, { validators: [Validators.required] }),
    sequence  : new FormControl<number | null>(null),
    bizType   : new FormControl<string | null>(null, { validators: [Validators.required] }),
    comment   : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.getSystemList();
  }

  ngAfterViewInit(): void {
    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  newForm(): void {
    this.formType = FormType.NEW;
  }

  modifyForm(formData: BizCodeType): void {
    this.formType = FormType.MODIFY;
    this.fg.controls.typeId.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<BizCodeType>) => {
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
      this.checkForm()
      return;
    }

    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<BizCodeType>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    this.service
        .delete(this.fg.controls.typeId.value!)
        .subscribe(
          (model: ResponseObject<BizCodeType>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getSystemList(): void {
    this.service
        .getSystemList()
        .subscribe(
          (model: ResponseList<SelectControlModel>) => {
            if (model.total > 0) {
              this.bizTypeList = model.data;
            } else {
              this.bizTypeList = [];
            }
          }
        );
  }
}
