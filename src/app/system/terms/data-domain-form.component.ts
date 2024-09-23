import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { DataDomainService } from './data-domain.service';
import { DataDomain } from './data-domain.model';
import { HtmlSelectOption } from 'src/app/shared-component/nz-input-select-custom/html-select-option';

import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from 'src/app/shared-component/nz-form-item-custom/nz-form-item-custom.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputSelectCustomComponent } from 'src/app/shared-component/nz-input-select-custom/nz-input-select-custom.component';


@Component({
  selector: 'app-data-domain-form',
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
          <nz-form-item-custom for="domainId" label="도메인ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="domainId" formControlName="domainId" required
                placeholder="도메인Id를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="database" label="database" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select-custom required
                formControlName="database" itemId="database"
                [options]="databaseList" [opt_value]="'value'" [opt_label]="'label'"
                placeholder="database을 입력해주세요.">
              </nz-input-select-custom>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="domainName" label="도메인명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="domainName" formControlName="domainName" required
                placeholder="도메인명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="dataType" label="dataType" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="dataType" formControlName="dataType" required
                placeholder="dataType을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="비고">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="비고를 입력해주세요." [rows]="10">
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
  styles: [``]
})
export class DataDomainFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  databaseList: HtmlSelectOption[] = [];

  //domainName = viewChild.required<NzInputTextComponent>('domainName');

  private service = inject(DataDomainService);
  private appAlarmService = inject(AppAlarmService);

  override fg = inject(FormBuilder).group({
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
//    this.domainName().focus();
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
