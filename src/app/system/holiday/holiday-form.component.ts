import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HolidayService } from './holiday.service';
import { Holiday } from './holiday.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormItemCustomComponent } from "src/app/shared-component/nz-form-item-custom/nz-form-item-custom.component";


@Component({
  selector: 'app-holiday-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzFormItemCustomComponent
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
          <nz-form-item-custom for="date" label="휴일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="date" formControlName="date" style="width: 150px">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="holidayName" label="휴일명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="holidayName" formControlName="holidayName" required
                placeholder="휴일명을 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="설명">
            <nz-form-control>
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="설명을 입력해주세요." [rows]="13">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class HolidayFormComponent extends FormBase implements OnInit, AfterViewInit {

  private service = inject(HolidayService);
  private appAlarmService = inject(AppAlarmService);

  override fg = inject(FormBuilder).group({
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
      this.checkForm();
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
