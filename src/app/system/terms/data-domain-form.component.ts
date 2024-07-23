import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';

import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { DataDomainService } from './data-domain.service';
import { DataDomain } from './data-domain.model';
import { HtmlSelectOption } from 'src/app/shared-component/nz-input-select/html-select-option';


@Component({
  selector: 'app-data-domain-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzInputTextComponent, NzInputTextareaComponent, NzInputSelectComponent, NzCrudButtonGroupComponent
  ],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.valid}}
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
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="domainId" itemId="domainId"
            placeholder="도메인Id를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">도메인ID
          </app-nz-input-text>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <!--
          <app-nz-input-text
            formControlName="database" itemId="database"
            placeholder="database을 입력해주세요."
            [nzErrorTip]="errorTpl" [required]="true">database
          </app-nz-input-text>
          -->

          <app-nz-input-select
            formControlName="database" itemId="database"
            [options]="databaseList" [opt_value]="'value'" [opt_label]="'label'"
            placeholder="database을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">database
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text #domainName
            formControlName="domainName" itemId="domainName"
            placeholder="도메인명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">도메인명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="dataType" itemId="dataType"
            placeholder="dataType을 입력해주세요."
            [nzErrorTip]="errorTpl" [required]="true">dataType
          </app-nz-input-text>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="비고를 입력해주세요."
            [rows] = "23"
            [required]="false" [nzErrorTip]="errorTpl">비고
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
  styles: [``]
})
export class DataDomainFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  databaseList: HtmlSelectOption[] = [];

  domainName = viewChild.required<NzInputTextComponent>('domainName');

  private fb = inject(FormBuilder);
  private service = inject(DataDomainService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    domainId      : new FormControl<string | null>(null, { validators: Validators.required }),
    domainName    : new FormControl<string | null>(null, { validators: Validators.required }),
    database      : new FormControl<string | null>(null, { validators: Validators.required }),
    dataType      : new FormControl<string | null>(null),
    comment       : new FormControl<string | null>(null)
  });

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.getDatabaseList();

    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
    this.focus();
  }

  focus() {
    this.domainName().focus();
  }

  newForm() {
    this.formType = FormType.NEW;

    this.fg.controls.database.enable();
    this.fg.controls.domainName.enable();

    this.fg.controls.domainName.setValue('MYSQL');
  }

  modifyForm(formData: DataDomain) {
    this.formType = FormType.MODIFY;

    this.fg.controls.database.disable();
    this.fg.controls.domainName.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<DataDomain>) => {
            if ( model.total > 0 ) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save() {
    if (this.fg.invalid) {
      this.checkForm()
      return;
    }

    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<DataDomain>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove() {
    this.service
        .delete(this.fg.controls.domainId.value!)
        .subscribe(
          (model: ResponseObject<DataDomain>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  getDatabaseList() {
    this.service
        .getDatabaseList()
        .subscribe(
          (model: ResponseList<HtmlSelectOption>) => {
            this.databaseList = model.data;
          }
        );
  }
}
