import {Component, AfterViewInit, Input, viewChild} from "@angular/core";
// npm i @daypilot/daypilot-lite-angular
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";

@Component({
  selector: 'app-daypilot-calendar-basic',
  template: `
    <div class="container">
      <div class="navigator">
        <daypilot-navigator [config]="configNavigator" [events]="events" [(date)]="date" (dateChange)="changeDate($event)" #navigator></daypilot-navigator>
      </div>

      <div class="content">

        <div class="header">
          <div class="nav-buttons">
            <button (click)="navigatePrevious($event)" class="direction-button"><</button>
            <button (click)="navigateToday($event)">Today</button>
            <button (click)="navigateNext($event)" class="direction-button">></button>
          </div>

          <div class="title">
            <div *ngIf="configNavigator.selectMode === 'Day'">
              {{navigator.date.toDate() | date : 'YYYY-MM-dd' }}
            </div>
            <div *ngIf="configNavigator.selectMode === 'Week'">
              {{navigator.date.toDate() | date : 'YYYY-MM' }}
            </div>
            <div *ngIf="configNavigator.selectMode === 'Month'">
              {{navigator.date.toDate() | date : 'YYYY-MM' }}
            </div>
          </div>

          <div class="view-buttons">
            <button (click)="viewDay()" [class]="this.configNavigator.selectMode == 'Day' ? 'selected' : ''">Day</button>
            <button (click)="viewWeek()" [class]="this.configNavigator.selectMode == 'Week' ? 'selected' : ''">Week</button>
            <button (click)="viewMonth()" [class]="this.configNavigator.selectMode == 'Month' ? 'selected' : ''">Month</button>
          </div>
        </div>

        <daypilot-calendar [config]="configDay" [events]="events" #day></daypilot-calendar>
        <daypilot-calendar [config]="configWeek" [events]="events" #week></daypilot-calendar>
        <daypilot-month [config]="configMonth" [events]="events" #month></daypilot-month>

      </div>
    </div>
  `,
  styleUrls: ['./daypilot-calendar-basic.component.css']
})
export class DaypilotCalendarBasicComponent implements AfterViewInit {

  nav = viewChild.required<DayPilotNavigatorComponent>('navigator');
  day = viewChild.required<DayPilotCalendarComponent>('day');
  week = viewChild.required<DayPilotCalendarComponent>('week');
  month = viewChild.required<DayPilotMonthComponent>('month');

  @Input() events: DayPilot.EventData[] = [];

  date = DayPilot.Date.today();
  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 1,
    cellWidth: 25,
    cellHeight: 25,
    locale: 'ko-kr',
    onVisibleRangeChanged: (params: {start:DayPilot.Date , end:DayPilot.Date}) => {
      console.log(params);
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.nav().date = date;
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;

    console.log('dateChanged: '+ date );
  }

  configDay: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    locale: 'ko-kr'
  };

  configWeek: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    viewType: "Week",
    locale: 'ko-kr',
    onTimeRangeSelected: async (params) => {
      console.log(params);
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
  };

  configMonth: DayPilot.MonthConfig = {
    startDate: DayPilot.Date.today(),
    locale: 'ko-kr',
    onTimeRangeSelected: async (params: DayPilot.MonthTimeRangeSelectedArgs) => {
      console.log(params);
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
    },
    onEventClick:async (params: DayPilot.MonthEventClickArgs) => {
      //console.log(params);
    }
  };

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
        weekStarts: 0
      }
    );

    DayPilot.Locale.register(localeKR);

    this.viewMonth();
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const from = this.nav().control.visibleStart();
    const to = this.nav().control.visibleEnd();
    //console.log('from: ' + from);
    //console.log('to: ' + to);
  }

  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  navigatePrevious(event: any): void {
    event.preventDefault();

    if (this.configNavigator.selectMode === 'Day') {
      this.changeDate((this.configDay.startDate as DayPilot.Date).addDays(-1));
    } else if (this.configNavigator.selectMode === 'Week') {
      this.changeDate((this.configWeek.startDate as DayPilot.Date).addDays(-7));
    } else if (this.configNavigator.selectMode === 'Month') {
      this.changeDate((this.configMonth.startDate as DayPilot.Date).addMonths(-1));
    }
  }

  navigateNext(event: any): void {
    event.preventDefault();

    if (this.configNavigator.selectMode === 'Day') {
      this.changeDate((this.configDay.startDate as DayPilot.Date).addDays(1));
    } else if (this.configNavigator.selectMode === 'Week') {
      this.changeDate((this.configWeek.startDate as DayPilot.Date).addDays(7));
    } else if (this.configNavigator.selectMode === 'Month') {
      this.changeDate((this.configMonth.startDate as DayPilot.Date).addMonths(1));
    }
  }

  navigateToday(event: any): void {
    event.preventDefault();

    this.changeDate(DayPilot.Date.today());
  }

}
