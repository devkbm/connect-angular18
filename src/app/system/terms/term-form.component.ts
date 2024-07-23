import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';

import { Component, OnInit, Output, EventEmitter, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TermService } from './term.service';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { Term } from './term.model';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseList } from 'src/app/core/model/response-list';
import { WordService } from './word.service';
import { Word } from './word.model';
import { DataDomain } from './data-domain.model';
import { DataDomainService } from './data-domain.service';

@Component({
  selector: 'app-term-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzInputTextComponent, NzInputTextareaComponent, NzInputSelectComponent, NzCrudButtonGroupComponent
  ],
  template: `
    {{fg.value | json}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-text #title
            formControlName="termId" itemId="termId"
            placeholder=""
            [required]="true" [nzErrorTip]="errorTpl">용어ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="12">
          <!--
          <app-nz-input-text
            formControlName="system" itemId="system"
            placeholder="시스템를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">시스템
          </app-nz-input-text>
          -->

          <app-nz-input-select
            formControlName="system" itemId="system"
            [options]="systemTypeList" [opt_value]="'value'" [opt_label]="'label'"
            placeholder="Please select"
            [required]="true" [nzErrorTip]="errorTpl">시스템
          </app-nz-input-select>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <!--
          <app-nz-input-text
            formControlName="term" itemId="term"
            placeholder="용어를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">용어
          </app-nz-input-text>
          -->

          <app-nz-input-select
            formControlName="term" itemId="term"
            [options]="wordList" [opt_value]="'logicalName'" [opt_label]="'logicalName'" [mode]="'multiple'"
            placeholder="Please select"
            [required]="true" [nzErrorTip]="errorTpl">용어
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="columnName" itemId="columnName"
            placeholder=""
            [required]="false" [nzErrorTip]="errorTpl">컬럼명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-select
            formControlName="dataDomainId" itemId="dataDomainId"
            [options]="dataDomainList" [opt_value]="'domainId'" [opt_label]="'domainName'"
            placeholder="Please select"
            [required]="true" [nzErrorTip]="errorTpl">도메인
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="termEng" itemId="termEng"
            placeholder="용어(영문)를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">용어(영문)
          </app-nz-input-text>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <!--설명 필드-->
          <app-nz-input-textarea
            formControlName="description" itemId="description"
            placeholder="설명을 입력해주세요."
            [rows] = "20"
            [required]="false" [nzErrorTip]="errorTpl">설명
          </app-nz-input-textarea>
        </div>

        <div nz-col nzSpan="12">
          <!--설명 필드-->
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="비고을 입력해주세요."
            [rows] = "20"
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
    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding-left: auto;
      padding-right: 5;
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
export class TermFormComponent extends FormBase implements OnInit, AfterViewInit {
  systemTypeList: any;
  wordList: Word[] = [];
  dataDomainList: DataDomain[] = [];

  private fb = inject(FormBuilder);
  private service = inject(TermService);
  private wordService = inject(WordService);
  private dataDomainService = inject(DataDomainService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    termId       : new FormControl<string | null>(null),
    system       : new FormControl<string | null>(null, { validators: Validators.required }),
    term         : new FormControl<string | null>(null, { validators: Validators.required }),
    termEng      : new FormControl<string | null>(null),
    columnName   : new FormControl<string | null>(null),
    dataDomainId : new FormControl<string | null>(null),
    description  : new FormControl<string | null>(null),
    comment      : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.getSystemTypeList();
    this.getWordList();
    this.getDataDoaminList();

    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {

  }

  newForm() {
    this.formType = FormType.NEW;

    this.fg.controls.termId.disable();
    this.fg.controls.columnName.disable();
    this.fg.controls.system.enable();
    this.fg.controls.term.enable();
  }

  modifyForm(formData: Term) {
    this.formType = FormType.MODIFY;

    this.fg.controls.termId.disable();
    this.fg.controls.columnName.disable();
    this.fg.controls.system.disable();
    this.fg.controls.term.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<Term>) => {
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
          (model: ResponseObject<Term>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove() {
    this.service
        .delete(this.fg.controls.termId.value!)
        .subscribe(
          (model: ResponseObject<Term>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getSystemTypeList() {
    this.service
        .getSystemTypeList()
        .subscribe(
          (model: ResponseList<any>) => {
            this.systemTypeList = model.data;
          }
        );
  }

  getWordList() {
    this.wordService
        .getList()
        .subscribe(
          (model: ResponseList<Word>) => {
            this.wordList = model.data;
          }
        );
  }

  getDataDoaminList() {
    this.dataDomainService
        .getList()
        .subscribe(
          (model: ResponseList<DataDomain>) => {
            this.dataDomainList = model.data;
          }
        );
  }

}
