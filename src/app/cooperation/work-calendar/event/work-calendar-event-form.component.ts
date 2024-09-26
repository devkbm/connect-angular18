import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { WorkCalendarEvent } from './work-calendar-event.model';
import { WorkCalendarEventService } from './work-calendar-event.service';
import { WorkCalendarService } from '../calendar/work-calendar.service';
import { WorkCalendar } from '../calendar/work-calendar.model';

import * as dateFns from "date-fns";

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from 'src/app/shared-component/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputDateTimeComponent, TimeFormat } from 'src/app/shared-component/nz-input-datetime/nz-input-datetime.component';

export interface NewFormValue {
  workCalendarId: number;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-work-calendar-event-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzCrudButtonGroupComponent,
    NzInputDateTimeComponent,
    NzFormItemCustomComponent,
    NzInputSelectComponent
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="workCalendarId" label="작업그룹 ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="workCalendarId" itemId="workCalendarId"
                [options]="workGroupList" [opt_value]="'id'" [opt_label]="'name'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="id" label="일정ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="id" formControlName="id" required
                placeholder="일정ID를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <!--
        <div nz-col nzSpan="20">
          <nz-form-item class="form-item">
            <nz-form-label nzFor="start" [nzXs]="defaultLabelSize.xs" [nzSm]="defaultLabelSize.sm">기간</nz-form-label>
            <nz-form-control [nzXs]="defaultControlSize.xs" [nzSm]="defaultControlSize.sm">
              <nz-date-picker formControlName="start" nzFormat="yyyy-MM-dd" style="width: 130px"></nz-date-picker>
              <nz-time-picker formControlName="start" [nzMinuteStep]="30" [nzFormat]="'HH:mm'" style="width: 90px" [nzNowText]="' '"></nz-time-picker> ~
              <nz-date-picker formControlName="end" nzFormat="yyyy-MM-dd" style="width: 130px"></nz-date-picker>
              <nz-time-picker formControlName="end" [nzMinuteStep]="30" [nzFormat]="'HH:mm'" style="width: 90px" [nzNowText]="' '"></nz-time-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
        -->
        <div nz-col nzSpan="10">
          <app-nz-input-datetime
            formControlName="start" itemId="start" [timeFormat]="timeFormat"
            [required]="true" [nzErrorTip]="errorTpl">시작일
          </app-nz-input-datetime>
        </div>
        <div nz-col nzSpan="10">
          <app-nz-input-datetime
            formControlName="end" itemId="end"
            [required]="true" [nzErrorTip]="errorTpl">종료일
          </app-nz-input-datetime>
        </div>
        <div nz-col nzSpan="4">
          <nz-form-item-custom for="useYn" label="종일">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="useYn" formControlName="useYn"></label>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <nz-form-item-custom for="text" label="제목">
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <textarea nz-input id="text" formControlName="text"
          placeholder="제목을 입력해주세요." [rows]="20">
          </textarea>
        </nz-form-control>
      </nz-form-item-custom>
    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(fg.controls.id.value!)">
      </app-nz-crud-button-group>
    </div>

  `,
  styles: [`
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
export class WorkCalendarEventFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  //text = viewChild.required<NzInputTextareaComponent>('text');

  @Input() override initLoadId: number = -1;
  @Input() newFormValue?: NewFormValue;

  timeFormat: TimeFormat = TimeFormat.HourMinute;

  workGroupList: WorkCalendar[] = [];

  private service = inject(WorkCalendarEventService);
  private workGroupService = inject(WorkCalendarService);

  override fg = inject(FormBuilder).group({
    id              : new FormControl<string | null>({value: null, disabled: true}, { validators: [Validators.required] }),
    text            : new FormControl<string | null>(null, { validators: [Validators.required] }),
    start           : new FormControl<string | null>(null),
    end             : new FormControl<string | null>(null),
    allDay          : new FormControl<boolean | null>(null),
    workCalendarId  : new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  ngOnInit(): void {
    this.getMyWorkGroupList();

    if (this.initLoadId > 0) {
      this.get(this.initLoadId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.newFormValue) {
      this.newForm(this.newFormValue);
    }
  }

  ngAfterViewInit(): void {
    //this.text().focus();
  }

  newForm(params: NewFormValue): void {
    this.formType = FormType.NEW;

    // 30분 단위로 입력받기 위해 초,밀리초 초기화
    params.start.setSeconds(0);
    params.start.setMilliseconds(0);
    params.end.setSeconds(0);
    params.end.setMilliseconds(0);

    this.fg.controls.workCalendarId.setValue(Number.parseInt(params.workCalendarId.toString(),10));
    this.fg.controls.start.setValue(dateFns.format(params.start, "yyyy-MM-dd HH:mm:ss"));
    this.fg.controls.end.setValue(dateFns.format(params.end, "yyyy-MM-dd HH:mm:ss"));
  }

  modifyForm(formData: WorkCalendarEvent): void {
    this.formType = FormType.MODIFY;

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: number): void {
    this.service.getWorkGroupSchedule(id)
        .subscribe(
            (model: ResponseObject<WorkCalendarEvent>) => {
              if (model.data) {
                console.log(model.data);
                this.modifyForm(model.data);
              }
            }
        );
  }

  save(): void {
    if (this.fg.invalid) {
      this.checkForm();
      return;
    }

    this.service
        .saveWorkGroupSchedule(this.fg.getRawValue())
        .subscribe(
            (model: ResponseObject<WorkCalendarEvent>) => {
              this.formSaved.emit(this.fg.getRawValue());
            }
        );
  }

  remove(id: string): void {
    this.service.deleteWorkGroupSchedule(id)
        .subscribe(
            (model: ResponseObject<WorkCalendarEvent>) => {
              this.formDeleted.emit(this.fg.getRawValue());
            }
        );
  }

  getMyWorkGroupList(): void {
    this.workGroupService
        .getMyWorkGroupList()
        .subscribe(
          (model: ResponseList<WorkCalendar>) => {
            if (model.total > 0) {
                this.workGroupList = model.data;
            } else {
                this.workGroupList = [];
            }
            //this.appAlarmService.changeMessage(model.message);
          }
        );
  }
}
