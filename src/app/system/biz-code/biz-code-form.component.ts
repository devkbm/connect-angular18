import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { FormBase, FormType } from 'src/app/core/form/form-base';

import { ResponseObject } from 'src/app/core/model/response-object';

import { BizCodeService } from './biz-code.service';
import { BizCode } from './biz-code.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from "../../shared-component/nz-form-item-custom/nz-form-item-custom.component";

@Component({
  selector: 'app-biz-code-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzInputNumberModule,
    NzCrudButtonGroupComponent,
    NzFormItemCustomComponent
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
          <nz-form-item-custom for="typeId" label="업무코드분류ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeId" formControlName="typeId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="code" label="코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="code" formControlName="code" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="codeName" label="코드명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="codeName" formControlName="codeName" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="useYn" label="사용여부" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="useYn" formControlName="useYn"></label>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="sequence" label="순번" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="비고">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="comment" formControlName="comment"
              placeholder="비고를 입력해주세요." [rows]="20">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
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

  private service = inject(BizCodeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = inject(FormBuilder).group({
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
