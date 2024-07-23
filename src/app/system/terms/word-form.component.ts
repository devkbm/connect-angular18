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

import { ResponseObject } from 'src/app/core/model/response-object';
import { WordService } from './word.service';
import { Word } from './word.model';

@Component({
  selector: 'app-word-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzInputTextComponent, NzInputTextareaComponent, NzInputSelectComponent, NzCrudButtonGroupComponent
  ],
  template: `
    {{initLoadId | json}} - {{fg.getRawValue() | json}} - {{fg.valid}}
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
        <div nz-col nzSpan="8">
          <app-nz-input-text #logicalName
            formControlName="logicalName" itemId="logicalName"
            placeholder="logicalName을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">logicalName
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="physicalName" itemId="physicalName"
            placeholder="physicalName 입력해주세요."
            [nzErrorTip]="errorTpl" [required]="true">physicalName
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="logicalNameEng" itemId="logicalNameEng"
            placeholder="logicalNameEng 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">logicalNameEng
          </app-nz-input-text>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="비고를 입력해주세요."
            [rows] = "25"
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
export class WordFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  logicalName = viewChild.required<NzInputTextComponent>('logicalName');

  private fb = inject(FormBuilder);
  private service = inject(WordService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    logicalName     : new FormControl<string | null>(null, { validators: Validators.required }),
    physicalName    : new FormControl<string | null>(null, { validators: Validators.required }),
    logicalNameEng  : new FormControl<string | null>(null),
    comment         : new FormControl<string | null>(null)
  });

  ngOnInit() {
    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
    this.focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  focus() {
    this.logicalName().focus();
  }

  newForm() {
    this.formType = FormType.NEW;

    this.fg.controls.logicalName.enable();
    this.fg.controls.physicalName.enable();
  }

  modifyForm(formData: Word) {
    this.formType = FormType.MODIFY;

    this.fg.controls.logicalName.disable();
    this.fg.controls.physicalName.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<Word>) => {
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
          (model: ResponseObject<Word>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove() {
    this.service
        .delete(this.fg.controls.logicalName.value!)
        .subscribe(
          (model: ResponseObject<Word>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

}
