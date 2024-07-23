import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';

import { Component, OnInit, AfterViewInit, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HrmCodeTypeService } from './hrm-code-type.service';
import { HrmType } from './hrm-type.model';
import { existingHrmTypeValidator } from './hrm-code-type-duplication-validator';

@Component({
  selector: 'app-hrm-code-type-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzFormModule, NzDividerModule, NzInputTextComponent, NzInputTextareaComponent,
    NzInputSelectComponent, NzInputDateComponent, NzInputNumberCustomComponent, NzCrudButtonGroupComponent
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
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
        <div nz-col nzSpan="10">
          <app-nz-input-text #typeId
            formControlName="typeId" itemId="typeId"
            placeholder="구분ID를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">구분ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="10">
          <app-nz-input-text
            formControlName="typeName" itemId="typeName"
            placeholder="구분명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">구분명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="4">
          <app-nz-input-number-custom
            formControlName="sequence" itemId="sequence"
            [required]="true" [nzErrorTip]="errorTpl">출력 순번
          </app-nz-input-number-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="설명을 입력해주세요."
            [rows] = "8"
            [required]="false" [nzErrorTip]="errorTpl">설명
          </app-nz-input-textarea>
        </div>
      </div>

      <!--
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the1AddInfoDesc" itemId="the1AddInfoDesc"
            placeholder="설명을 입력해주세요."
            [rows] = "3"
            [required]="false" [nzErrorTip]="errorTpl">추가정보1 설명
          </app-nz-input-textarea>
        </div>
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the2AddInfoDesc" itemId="the2AddInfoDesc"
            placeholder="설명을 입력해주세요."
            [rows] = "3"
            [required]="false" [nzErrorTip]="errorTpl">추가정보2 설명
          </app-nz-input-textarea>
        </div>
      </div>


      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the3AddInfoDesc" itemId="the3AddInfoDesc"
            placeholder="설명을 입력해주세요."
            [rows] = "3"
            [required]="false" [nzErrorTip]="errorTpl">추가정보3 설명
          </app-nz-input-textarea>
        </div>
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the4AddInfoDesc" itemId="the4AddInfoDesc"
            placeholder="설명을 입력해주세요."
            [rows] = "3"
            [required]="false" [nzErrorTip]="errorTpl">추가정보4 설명
          </app-nz-input-textarea>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-textarea
            formControlName="the5AddInfoDesc" itemId="the5AddInfoDesc"
            placeholder="설명을 입력해주세요."
            [rows] = "3"
            [required]="false" [nzErrorTip]="errorTpl">추가정보5 설명
          </app-nz-input-textarea>
        </div>
      </div>
      -->

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
export class HrmCodeTypeFormComponent extends FormBase implements OnInit, AfterViewInit {

  typeId = viewChild.required<NzInputTextComponent>('typeId');

  private fb = inject(FormBuilder);
  private service = inject(HrmCodeTypeService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    typeId          : new FormControl<string | null>(null, {
                        validators: Validators.required,
                        asyncValidators: [existingHrmTypeValidator(this.service)],
                        updateOn: 'blur'
                      }),
    typeName        : new FormControl<string | null>(null, { validators: Validators.required }),
    sequence        : new FormControl<number | null>(0),
    comment         : new FormControl<string | null>(null)
    /*
    the1AddInfoDesc : new FormControl<string | null>(null),
    the2AddInfoDesc : new FormControl<string | null>(null),
    the3AddInfoDesc : new FormControl<string | null>(null),
    the4AddInfoDesc : new FormControl<string | null>(null),
    the5AddInfoDesc : new FormControl<string | null>(null)
    */
  });

  ngOnInit() {

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

    this.fg.reset();
    this.fg.controls.typeId.enable();

    this.typeId().focus();
  }

  modifyForm(formData: HrmType): void {
    this.formType = FormType.MODIFY;

    this.fg.patchValue(formData);
    this.fg.controls.typeId.disable();
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  select(param: any) {
    this.get(param.value['typeId']);
  }

  get(code: string): void {
    this.service
        .get(code)
        .subscribe(
          (model: ResponseObject<HrmType>) => {
            if ( model.total > 0 ) {
              console.log(model.data);
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
          (model: ResponseObject<HrmType>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    const id = this.fg.controls.typeId.value!;

    this.service
        .remove(id)
        .subscribe(
            (model: ResponseObject<HrmType>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
            }
        );
  }

}

