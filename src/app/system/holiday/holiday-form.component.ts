import { CommonModule, formatDate } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';

import { Component, OnInit, Output, EventEmitter, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { HolidayService } from './holiday.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { Holiday } from './holiday.model';
import { style } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-holiday-form',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    NzCrudButtonGroupComponent, NzInputTextComponent, NzInputTextareaComponent, NzInputDateComponent
  ],
  template: `
    {{fg.value | json}} - {{fg.valid}}
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
        <div nz-col nzSpan="12">
          <!--휴일 필드-->
          <app-nz-input-date
            formControlName="date" itemId="date"
            [required]="true" [nzErrorTip]="errorTpl">휴일
          </app-nz-input-date>
        </div>

        <div nz-col nzSpan="12">
          <!--휴일명 필드 -->
          <app-nz-input-text
            formControlName="holidayName" itemId="holidayName"
            placeholder="휴일명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">휴일명
          </app-nz-input-text>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <!--설명 필드-->
          <app-nz-input-textarea
            formControlName="comment" itemId="comment"
            placeholder="설명을 입력해주세요."
            [rows]="25"
            [required]="false" [nzErrorTip]="errorTpl">설명
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
export class HolidayFormComponent extends FormBase implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  private service = inject(HolidayService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    date          : new FormControl<Date | null>(null, { validators: Validators.required }),
    holidayName   : new FormControl<string | null>(null, { validators: Validators.required }),
    comment       : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm(new Date());
    }
  }

  ngAfterViewInit(): void {
  }

  newForm(date: Date): void {
    this.formType = FormType.NEW;
    this.fg.reset();

    this.fg.controls.date.setValue(date);
  }

  modifyForm(formData: Holiday): void {
    this.formType = FormType.MODIFY;

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(date: Date): void {
    const id = formatDate(date,'YYYYMMdd','ko-kr');

    this.service
        .getHoliday(id)
        .subscribe(
            (model: ResponseObject<Holiday>) => {
              if ( model.total > 0 ) {
                this.modifyForm(model.data);
              } else {
                this.newForm(date);
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
        .saveHoliday(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<Holiday>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .deleteHoliday(formatDate(this.fg.controls.date.value!,'YYYYMMdd','ko-kr'))
        .subscribe(
          (model: ResponseObject<Holiday>) => {
          this.appAlarmService.changeMessage(model.message);
          this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

}
