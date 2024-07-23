import { CommonModule, formatDate } from '@angular/common';

import { Component, Input, AfterViewInit, inject, viewChild, output } from '@angular/core';

import { ResponseList } from 'src/app/core/model/response-list';

import { DaypilotCalendarComponent, ModeChangedArgs } from 'src/app/shared-component/calendar/daypilot-calendar.component';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { WorkCalendarEventService } from '../event/work-calendar-event.service';
import { WorkCalendarEvent } from '../event/work-calendar-event.model';
import { DaypilotCalendarHeaderComponent } from "../../../shared-component/calendar/daypilot-calendar-header.component";


export interface NewDateSelectedArgs {
  workCalendarId: number;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-work-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    DaypilotCalendarComponent,
    DaypilotCalendarHeaderComponent
  ],
  template: `
  <!--
  <div class="calendar-div">
      <full-calendar #calendar [options]="calendarOptions">
      </full-calendar>
  </div>
  -->
  <app-daypilot-calendar-header
    [titleStartDate]="calendar.start.toDate()"
    [titleEndDate]="calendar.end.toDate()"
    (previousButtonClicked)="calendar.navigatePrevious($event)"
    (todayButtonClicked)="calendar.navigateToday($event)"
    (nextButtonClicked)="calendar.navigateNext($event)"
    (selectedModeChanged)="calendar.modeChange($event)">
  </app-daypilot-calendar-header>

  <div class="calendar-div">
    <app-daypilot-calendar
      #calendar
      [events]="eventData"
      (eventClicked)="eventClicked($event)"
      (rangeChanged)="rangeChanged($event)"
      (datesSelected)="onDateClick($event)"
      (modeChanged)="calendarModeChanged($event)">
    </app-daypilot-calendar>
  </div>
`,
  styles: [`
  .calendar-div {
    /*max-height: 800px; */
    overflow-y: hidden;
    overflow-x: hidden;
    overflow: auto;
    height: calc(100% - 50px);
  }
`]
})
export class WorkCalendarViewComponent implements AfterViewInit {

  calendar = viewChild.required(DaypilotCalendarComponent);

  @Input() fkWorkCalendar: number = 0;

  itemSelected = output<any>();
  newDateSelected = output<NewDateSelectedArgs>();
  eventDataChanged = output<any>();
  visibleRangeChanged = output<{start: Date, end: Date, date: Date}>();
  modeChanged = output<ModeChangedArgs>();

  from!: string;
  to!: string;
  eventData: any[] = [];
  mode?: ModeChangedArgs;

  private service = inject(WorkCalendarEventService);

  ngAfterViewInit(): void {
    //this.from = this.datePipe.transform(this.calendar.start.toDateLocal(),'yyyyMMdd') ?? '';
    //this.to = this.datePipe.transform(this.calendar.end.toDateLocal(),'yyyyMMdd') ?? '';

    this.from = formatDate(this.calendar().start.toDateLocal(),'YYYYMMdd','ko-kr') ?? '';
    this.to = formatDate(this.calendar().end.toDateLocal(),'YYYYMMdd','ko-kr') ?? '';
  }

  rangeChanged(e: any): void {
    this.visibleRangeChanged.emit({start: e.start, end: e.end, date: e.date});

    //this.from = this.datePipe.transform(e.start,'yyyyMMdd') ?? '';
    //this.to = this.datePipe.transform(e.end,'yyyyMMdd') ?? '';

    this.from = formatDate(e.start,'YYYYMMdd','ko-kr') ?? '';
    this.to = formatDate(e.end,'YYYYMMdd','ko-kr') ?? '';

    this.getWorkScheduleList();
  }

  getWorkScheduleList(): void {
    const workGroupId: string = this.fkWorkCalendar.toString();

    if (workGroupId === "" || workGroupId === null || workGroupId === undefined) {
      this.eventData = [];
      return;
    }
    const param = {
      fkWorkCalendar : this.fkWorkCalendar,
      fromDate: this.from,
      toDate: this.to
    };

    this.service
        .getWorkScheduleList(param)
        .subscribe(
            (model: ResponseList<WorkCalendarEvent>) => {
              let data: any[] = [];

              model.data.forEach(e => data.push({
                id: e.id,
                text: e.text,
                start: new DayPilot.Date(e.start as string),
                end: new DayPilot.Date(e.end as string),
                barColor: e.color
              }));
              this.eventData = data;
              this.eventDataChanged.emit(this.eventData);
            }
        );
  }

  eventClicked(param: any): void {
    this.itemSelected.emit(param.id);
  }

  onDateClick(params: any): void {
    const eventArgs: NewDateSelectedArgs = {workCalendarId: this.fkWorkCalendar, start: params.start, end: params.end};
    this.newDateSelected.emit(eventArgs);
  }

  calendarModeChanged(params: ModeChangedArgs): void {
    this.mode = params;
    this.modeChanged.emit(this.mode);
  }

  calendarSetDate(date: DayPilot.Date) {
    this.calendar().rangeChangedEvent(date);
  }
}
