import {Component, AfterViewInit, Input, viewChild, output} from "@angular/core";
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotModule,
  DayPilotMonthComponent
} from "@daypilot/daypilot-lite-angular";
import { DaypilotCalendarHeaderComponent } from "./daypilot-calendar-header.component";

export interface ModeChangedArgs {
  readonly mode: "Day" | "Week" | "Month" | "None";
  readonly date: DayPilot.Date;
}

@Component({
  selector: 'app-daypilot-calendar',
  standalone: true,
  imports: [
    DaypilotCalendarHeaderComponent,
    DayPilotModule
  ],
  template: `
    <div class="calendar">
      <!--
      <app-daypilot-calendar-header
        [titleStartDate]="start.toDate()"
        [titleEndDate]="end.toDate()"
        (previousButtonClicked)="navigatePrevious($event)"
        (todayButtonClicked)="navigateToday($event)"
        (nextButtonClicked)="navigateNext($event)"
        (selectedModeChanged)="modeChange($event)">
      </app-daypilot-calendar-header>
      -->
      <div class="contents">
        <daypilot-calendar #day   [config]="configDay" [events]="events"></daypilot-calendar>
        <daypilot-calendar #week  [config]="configWeek" [events]="events"></daypilot-calendar>
        <daypilot-month    #month [config]="configMonth" [events]="events"></daypilot-month>
      </div>

    </div>
  `,
  styles: `
  .calendar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    vertical-align: top;
  }

  /* 달력 높이 100%가 안됨 */
  .contents {
    flex: 0 0 100%;
  }
  `
})
export class DaypilotCalendarComponent implements AfterViewInit {

  day = viewChild.required<DayPilotCalendarComponent>('day');
  week = viewChild.required<DayPilotCalendarComponent>('week');
  month = viewChild.required<DayPilotMonthComponent>('month');

  @Input() mode?: "Day" | "Week" | "Month" | "None" = "Month";
  @Input() events: DayPilot.EventData[] = [];

  datesSelected = output<{start: Date, end: Date}>();
  rangeChanged = output<{start: Date , end: Date, date: Date}>();
  eventClicked = output<any>();
  modeChanged = output<ModeChangedArgs>();

  selectedDate: DayPilot.Date;
  start: DayPilot.Date;
  end: DayPilot.Date;

  constructor() {
    const localeKR = new DayPilot.Locale(
      'ko-kr',
      {
        dayNames:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
        dayNamesShort:['일','월','화','수','목','금','토'],
        monthNames:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',''],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',''],
        timePattern:'h:mm tt',
        datePattern:'yyyy-M-d ddd',
        dateTimePattern:'yyyy-M-d h:mm tt',
        timeFormat:'Clock12Hours',
        weekStarts: 0                         // 0 일요일
      }
    );
    DayPilot.Locale.register(localeKR);

    this.selectedDate = DayPilot.Date.today();
    this.start = this.selectedDate.firstDayOfMonth().firstDayOfWeek('ko-kr');
    this.end = this.selectedDate.lastDayOfMonth().addDays(7).firstDayOfWeek('ko-kr').addDays(-1);
  }

  configDay: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    locale: 'ko-kr',
    heightSpec: 'BusinessHours',
    cellHeight: 41,
    onTimeRangeSelected: (params: DayPilot.CalendarTimeRangeSelectedArgs) => {
      this.setDate(params.start);
      this.datesSelected.emit({start: params.start.toDateLocal(), end: params.end.toDateLocal()});
    },
    onEventClicked: (params: DayPilot.CalendarEventClickedArgs) => {
      this.eventClicked.emit(params.e.data);
    }
  };

  configWeek: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    viewType: "Week",
    locale: 'ko-kr',
    heightSpec: 'BusinessHours',
    cellHeight: 41,
    onTimeRangeSelected: (params: DayPilot.CalendarTimeRangeSelectedArgs) => {
      this.setDate(params.start);
      this.datesSelected.emit({start: params.start.toDateLocal(), end: params.end.toDateLocal()});
    },
    onEventClicked: (params: DayPilot.CalendarEventClickedArgs) => {
      this.eventClicked.emit(params.e.data);
    }
  };

  configMonth: DayPilot.MonthConfig = {
    startDate: DayPilot.Date.today(),
    locale: 'ko-kr',
    cellHeight: 150,
    onTimeRangeSelected: (params: DayPilot.MonthTimeRangeSelectedArgs) => {
      this.setDate(params.start);
      this.datesSelected.emit({start: params.start.toDateLocal(), end: params.end.toDateLocal()});
    },
    onEventClicked: (params: DayPilot.MonthEventClickedArgs) => {
      this.eventClicked.emit(params.e.data);
    }
  };

  ngAfterViewInit(): void {
    this.viewMonth();
    // this.loadTestEvents();
  }

  setDate(date: DayPilot.Date) {
    this.selectedDate = date;
  }

  modeChange(mode: any) {
    console.log(mode);
    this.mode = mode;

    switch (this.mode) {
      case "Day": this.viewDay(); break;
      case "Week": this.viewWeek(); break;
      case "Month": this.viewMonth(); break;
      default: this.viewMonth(); break;
    }

  }

  viewDay(): void {
    this.mode = "Day";
    this.rangeChangedEvent(this.selectedDate);

    this.modeChanged.emit({mode: this.mode, date: this.selectedDate});
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek(): void {
    this.mode = "Week";
    this.rangeChangedEvent(this.selectedDate);

    this.modeChanged.emit({mode: this.mode, date: this.selectedDate});
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth(): void {
    this.mode = "Month";
    this.rangeChangedEvent(this.selectedDate);

    this.modeChanged.emit({mode: this.mode, date: this.selectedDate});
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  navigatePrevious(event: MouseEvent): void {
    event.preventDefault();
    if (this.mode === 'Day') {
      this.rangeChangedEvent(this.selectedDate.addDays(-1));
    } else if (this.mode === 'Week') {
      this.rangeChangedEvent(this.selectedDate.addDays(-7));
    } else if (this.mode === 'Month') {
      this.rangeChangedEvent(this.selectedDate.addMonths(-1));
    }
  }

  navigateNext(event: MouseEvent): void {
    event.preventDefault();
    if (this.mode === 'Day') {
      this.rangeChangedEvent(this.selectedDate.addDays(1));
    } else if (this.mode === 'Week') {
      this.rangeChangedEvent(this.selectedDate.addDays(7));
    } else if (this.mode === 'Month') {
      this.rangeChangedEvent(this.selectedDate.addMonths(1));
    }
  }

  navigateToday(event: MouseEvent): void {
    event.preventDefault();
    this.rangeChangedEvent(DayPilot.Date.today());
  }

  rangeChangedEvent(date: DayPilot.Date): void {
    if (this.mode === 'Day') {
      this.selectedDate = date;
      this.start = date;
      this.end = date;
      const range = {start: date.toDateLocal(), end: date.toDateLocal(), date: this.selectedDate.toDateLocal()};
      this.rangeChanged.emit(range);
      // Day Component
      this.configDay.startDate = this.start;
      this.day().control.startDate = this.start;
    } else if (this.mode === 'Week') {
      this.selectedDate = date;
      const sunday: DayPilot.Date = this.selectedDate.firstDayOfWeek('ko-kr');
      this.start = sunday;
      this.end = sunday.addDays(6);
      const range = {start: this.start.toDateLocal(), end: this.end.toDateLocal(), date: this.selectedDate.toDateLocal()};
      this.rangeChanged.emit(range);

      // Week Component
      this.week().control.startDate = this.start;
      this.configWeek.startDate = this.start;
    } else if (this.mode === 'Month') {
      this.selectedDate = date;
      //this.start = this.selectedDate.firstDayOfMonth().firstDayOfWeek('ko-kr');
      this.start = date;
      this.end = this.selectedDate.lastDayOfMonth().addDays(7).firstDayOfWeek('ko-kr').addDays(-1);
      const range = {start: this.start.toDateLocal(), end: this.end.toDateLocal(), date: this.selectedDate.toDateLocal()};
      this.rangeChanged.emit(range);

      // Month Component
      this.month().control.startDate = this.selectedDate;
      this.configMonth.startDate = this.selectedDate;
    }
  }

  loadTestEvents(): void {
    this.events = [{
      id: 1,
      start: "2022-08-01T13:00:00",
      end: "2022-08-01T15:00:00",
      text: "Event 1",
      barColor: "#f1c232"
    },
    {
      id: 2,
      start: "2022-08-24T02:00:00.000Z",
      end: "2022-08-24T04:00:00.000Z",
      text: "Event 2"
    },
    {
      id: 3,
      start: '2022-08-05T20:40:04.665+09:00',
      end: '2022-08-05T20:40:04.665+09:00',
      text: 'ddd'
    }];
  }

  async newEventModal(params: DayPilot.CalendarTimeRangeSelectedArgs | DayPilot.MonthTimeRangeSelectedArgs) {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    const dp = params.control;
    dp.clearSelection();
    if (!modal.result) { return; }
    dp.events.add(new DayPilot.Event({
      start: params.start,
      end: params.end,
      id: DayPilot.guid(),
      text: modal.result
    }));
  }

  dateLogging(): void {
    console.log('date: ' + this.selectedDate);

    console.log('configDay control: ' + this.configDay.startDate);
    console.log('configWeek control: ' + this.configWeek.startDate);
    console.log('configMonth control: ' + this.configMonth.startDate);

    console.log('day control: ' + this.day().control.startDate);
    console.log('week control: ' + this.week().control.startDate);
    console.log('month control: ' + this.month().control.startDate);
  }

}
