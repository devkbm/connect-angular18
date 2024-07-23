import { CommonModule } from '@angular/common';

import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { WebResourceService } from './web-resource.service';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { WebResource } from './web-resource.model';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { existingWebResourceValidator } from './web-resource-duplication-validator.directive';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResouceTypeEnum } from './resource-type-enum';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';

import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';

@Component({
  selector: 'app-web-resource-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzInputTextComponent, NzInputTextareaComponent, NzCrudButtonGroupComponent, NzInputSelectComponent
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
          <app-nz-input-text #resourceCode
            formControlName="resourceId" itemId="resourceId"
            placeholder="리소스ID를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">리소스ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="resourceName" itemId="resourceName"
            [required]="true" [nzErrorTip]="errorTpl">리소스명
          </app-nz-input-text>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-select
            formControlName="resourceType" itemId="resourceType"
            [options]="resourceTypeList"
            [placeholder]="'리소스타입을 선택해주세요'" [nzErrorTip]="errorTpl" [required]="true">리소스타입
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="url" itemId="url"
            placeholder="URL 정보를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">URL 정보
          </app-nz-input-text>

        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="description" itemId="description"
            placeholder="설명를 입력해주세요."
            [rows]="20">설명
          </app-nz-input-textarea>
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

  resourceCode = viewChild.required<NzInputTextComponent>('resourceCode');

  resourceTypeList: ResouceTypeEnum[] = [];

  private fb = inject(FormBuilder);
  private service = inject(WebResourceService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
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
    this.resourceCode().focus();
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
