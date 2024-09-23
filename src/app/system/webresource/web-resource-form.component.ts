import { Component, OnInit, AfterViewInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseList } from 'src/app/core/model/response-list';

import { WebResourceService } from './web-resource.service';
import { WebResource } from './web-resource.model';
import { existingWebResourceValidator } from './web-resource-duplication-validator.directive';
import { ResouceTypeEnum } from './resource-type-enum';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from 'src/app/shared-component/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectCustomComponent } from 'src/app/shared-component/nz-input-select-custom/nz-input-select-custom.component';


@Component({
  selector: 'app-web-resource-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCrudButtonGroupComponent,
    NzFormItemCustomComponent,
    NzInputSelectCustomComponent
  ],
  template: `
    {{fg.getRawValue()| json}} - {{fg.valid}}

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
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="resourceId" label="리소스ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="resourceId" formControlName="resourceId" required
                placeholder="리소스ID를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="resourceName" label="리소스명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="resourceName" formControlName="resourceName" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="resourceType" label="리소스타입" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select-custom required
                formControlName="resourceType" itemId="resourceType"
                [options]="resourceTypeList" [opt_value]="'value'" [opt_label]="'label'"
                placeholder="Please select">
              </nz-input-select-custom>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="url" label="URL 정보" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="url" formControlName="url" required
                placeholder="URL 정보를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="description" label="설명">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="description" formControlName="description"
                placeholder="설명를 입력해주세요." [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
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
export class WebResourceFormComponent extends FormBase implements OnInit, AfterViewInit {

  //resourceCode = viewChild.required<NzInputTextComponent>('resourceCode');

  resourceTypeList: ResouceTypeEnum[] = [];

  private service = inject(WebResourceService);
  private appAlarmService = inject(AppAlarmService);

  override fg = inject(FormBuilder).group({
    resourceId   : new FormControl<string | null>(null, {
      validators: Validators.required,
      asyncValidators: [existingWebResourceValidator(this.service)],
      updateOn: 'blur'
    }),
    resourceName  : new FormControl<string | null>('', {validators: [Validators.required]}),
    resourceType  : new FormControl<string | null>('', {validators: [Validators.required]}),
    url           : new FormControl<string | null>('', {validators: [Validators.required]}),
    description   : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.getCommonCodeList();

    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
    //this.resourceCode().focus();
  }

  newForm(): void {
    this.formType = FormType.NEW;

    this.fg.reset();
    this.fg.controls.resourceId.enable();
  }

  modifyForm(formData: WebResource): void {
    this.formType = FormType.MODIFY;

    this.fg.controls.resourceId.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<WebResource>) => {
            if ( model.total > 0 ) {
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
          (model: ResponseObject<WebResource>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove() {
    this.service
        .delete(this.fg.controls.resourceId.value!)
        .subscribe(
          (model: ResponseObject<WebResource>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getCommonCodeList() {
    this.service
        .getWebResourceTypeList()
        .subscribe(
        (model: ResponseList<ResouceTypeEnum>) => {
          if ( model.total > 0 ) {
            this.resourceTypeList = model.data;
          }
          this.appAlarmService.changeMessage(model.message);
        }
      );
  }

}
