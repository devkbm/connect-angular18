import { Component, OnInit, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { WorkCalendarEvent } from './work-calendar-event.model';
import { WorkCalendarEventService } from './work-calendar-event.service';

import { WorkCalendarService } from '../calendar/work-calendar.service';
import { WorkCalendar } from '../calendar/work-calendar.model';

import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputDateTimeComponent, TimeFormat } from 'src/app/shared-component/nz-input-datetime/nz-input-datetime.component';

import * as dateFns from "date-fns";
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputSimpleColorPickerComponent } from 'src/app/shared-component/nz-input-color-picker/nz-input-simple-color-picker.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputCheckboxComponent } from 'src/app/shared-component/nz-input-checkbox/nz-input-checkbox.component';

export interface NewFormValue {
  workCalendarId: number;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-work-calendar-event-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    NzInputTextComponent, NzCrudButtonGroupComponent, NzInputSimpleColorPickerComponent,
    NzInputSelectComponent, NzInputTextareaComponent, NzInputDateTimeComponent, NzInputCheckboxComponent
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
          <!--작업그룹ID 필드-->
          <app-nz-input-select
            formControlName="workCalendarId"
            [itemId]="'workCalendarId'"
            [options]="workGroupList" [opt_value]="'id'" [opt_label]="'name'"
            [placeholder]="'Please select'" [nzErrorTip]="errorTpl" [required]="true">작업그룹 ID
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="12">
          <!--일정ID 필드-->
          <app-nz-input-text
            formControlName="id"
            [itemId]="'id'"
            placeholder="일정ID를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">일정ID
          </app-nz-input-text>
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
          <app-nz-input-checkbox
            formControlName="allDay"
            [required]="false">종일
          </app-nz-input-checkbox>
        </div>

      </div>

      <!--제목 필드-->
      <!-- [nzAutoSize]="{ minRows: 10, maxRows: 20 }" -->
      <app-nz-input-textarea #text
        formControlName="text" itemId="text"
        placeholder="제목을 입력해주세요."
        [rows] = "20"
        [required]="true" [nzErrorTip]="errorTpl">제목
      </app-nz-input-textarea>
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

  text = viewChild.required<NzInputTextareaComponent>('text');

  @Input() override initLoadId: number = -1;
  @Input() newFormValue?: NewFormValue;

  timeFormat: TimeFormat = TimeFormat.HourMinute;

  workGroupList: WorkCalendar[] = [];

  private fb = inject(FormBuilder);
  private service = inject(WorkCalendarEventService);
  private workGroupService = inject(WorkCalendarService);

  override fg = this.fb.group({
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
    this.text().focus();
  }

  newForm(params: NewFormValue): void {
    this.formType = FormType.NEW;

    // 30분 단위로 입력받기 위해 초,밀리초 초기화
    params.start.setSeconds(0);
    params.start.setMilliseconds(0);
    params.end.setSeconds(0);
    params.end.setMilliseconds(0);

    //this.fg.get('workCalendarId')?.setValue(Number.parseInt(params.workCalendarId.toString(),10));
    this.fg.get('workCalendarId')?.setValue(Number.parseInt(params.workCalendarId.toString(),10));
    this.fg.get('start')?.setValue(dateFns.format(params.start, "yyyy-MM-dd HH:mm:ss"));
    this.fg.get('end')?.setValue(dateFns.format(params.end, "yyyy-MM-dd HH:mm:ss"));

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
