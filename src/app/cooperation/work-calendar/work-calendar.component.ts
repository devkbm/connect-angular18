import { Component, OnInit, viewChild } from '@angular/core';

import { DaypilotCalendarNavigatorComponent } from 'src/app/shared-component/calendar/daypilot-calendar-navigator.component';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { ModeChangedArgs } from 'src/app/shared-component/calendar/daypilot-calendar.component';

import { NewDateSelectedArgs, WorkCalendarViewComponent } from './calendar-view/work-calendar-view.component';
import { NewFormValue, WorkCalendarEventFormComponent } from './event/work-calendar-event-form.component';
import { MyWorkCalendarGridComponent } from './calendar/my-work-calendar-grid.component';
import { WorkCalendarFormComponent } from './calendar/work-calendar-form.component';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MyWorkCalendarListComponent } from './calendar/my-work-calendar-list.component';

@Component({
    selector: 'app-work-calendar',
    standalone: true,
    template: `
<button nz-button (click)="getMyWorkGroupList()">
  <span nz-icon nzType="search" nzTheme="outline"></span>
  조회
</button>

<button nz-button (click)="newWorkGroup()">
  <span nz-icon nzType="form" nzTheme="outline"></span>
  신규 CALENDAR
</button>

<button nz-button (click)="newSchedule()">
  <span nz-icon nzType="form" nzTheme="outline"></span>
  신규 일정
</button>

<div class="grid-wrapper">
  <app-daypilot-calendar-navigator #navigator
    class="navi"
    [events]="this.eventData"
    (selectChanged)="navigatorSelectChanged($event)">
  </app-daypilot-calendar-navigator>

  <app-my-work-calendar-grid class="title"
      #myWorkGroupGrid
      (rowClicked)="workGroupSelect($event)"
      (rowDoubleClicked)="modifyWorkGroup($event)">
  </app-my-work-calendar-grid>

  <!--
  <app-my-work-calendar-list class="title"
    (rowClicked)="workGroupSelect($event)"
    (rowDoubleClicked)="modifyWorkGroup($event)">
  </app-my-work-calendar-list>
  -->

  <app-work-calendar-view
      #workCalendar class="calendar"
      [fkWorkCalendar]="drawer.workGroup.selectedWorkGroupId"
      (itemSelected)="editSchedule($event)"
      (newDateSelected)="newScheduleByDateSelect($event)"
      (eventDataChanged)="eventDateChanged($event)"
      (visibleRangeChanged)="calendarVisibleRangeChanged($event)"
      (modeChanged)="modeChanged($event)">
  </app-work-calendar-view>
</div>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="720"
    [nzVisible]="drawer.schedule.visible"
    nzTitle="일정 등록"
    (nzOnClose)="closeScheduleDrawer()">

    <app-work-calendar-event-form *nzDrawerContent
        #workScheduleForm
        [initLoadId]="this.drawer.schedule.selectedScheduleId"
        [newFormValue]="this.newScheduleArgs"
        (formSaved)="getScheduleList()"
        (formDeleted)="getScheduleList()"
        (formClosed)="closeScheduleDrawer()">
    </app-work-calendar-event-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="720"
    [nzVisible]="drawer.workGroup.visible"
    nzTitle="CALENDAR 등록"
    (nzOnClose)="closeWorkGroupDrawer()">

    <app-work-calendar-form *nzDrawerContent
        #workGroupForm
        (formSaved)="getMyWorkGroupList()"
        (formDeleted)="getMyWorkGroupList()"
        (formClosed)="closeWorkGroupDrawer()">
    </app-work-calendar-form>
</nz-drawer>

  `,
    styles: `
.grid-wrapper {
  height: calc(100% - 32px);
  display: grid;
  grid-template-rows: 220px 1fr;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "navi calendar"
    "title calendar";
}

.navi {
  grid-area: navi;
  padding-top: 10px
}
.title {
  grid-area: title;
}
.calendar {
  grid-area: calendar;
}

  `,
    imports: [
        CommonModule,
        NzDrawerModule,
        NzButtonModule,
        NzIconModule,
        MyWorkCalendarListComponent,
        MyWorkCalendarGridComponent,
        WorkCalendarFormComponent,
        WorkCalendarViewComponent,
        WorkCalendarEventFormComponent,
        DaypilotCalendarNavigatorComponent
    ]
})
export class WorkCalendarComponent implements OnInit {

  myWorkGroupGrid = viewChild.required(MyWorkCalendarGridComponent);
  workCalendar = viewChild.required(WorkCalendarViewComponent);
  workScheduleForm = viewChild.required(WorkCalendarEventFormComponent);
  workGroupForm = viewChild.required(WorkCalendarFormComponent);
  navigator = viewChild.required(DaypilotCalendarNavigatorComponent);

  //scheduleDrawerVisible: boolean = false;

  mode: "Day" | "Week" | "Month" | "None" = 'Month';

  //selectedWorkGroupId: number = -1;
  //selectedScheduleId: number = -1;
  newScheduleArgs?: NewFormValue;
  eventData: any[] = [];

  drawer: {
    workGroup: { visible: boolean, selectedWorkGroupId: number },
    schedule: { visible: boolean, selectedScheduleId: number }
  } = {
    workGroup: { visible: false, selectedWorkGroupId: -1 },
    schedule: { visible: false, selectedScheduleId: -1 }
  }

  ngOnInit(): void {
    this.getMyWorkGroupList();
  }

  getMyWorkGroupList(): void {
    this.closeWorkGroupDrawer();
    this.myWorkGroupGrid().getMyWorkGroupList();
  }

  getScheduleList(): void {
    this.closeWorkGroupDrawer();
    this.closeScheduleDrawer();

    this.workCalendar().fkWorkCalendar = this.drawer.workGroup.selectedWorkGroupId;
    this.workCalendar().getWorkScheduleList();
  }

  openScheduleDrawer() {
    this.drawer.schedule.visible = true;
  }

  closeScheduleDrawer() {
    this.drawer.schedule.visible = false;

    this.workCalendar().fkWorkCalendar = this.drawer.workGroup.selectedWorkGroupId;
    this.workCalendar().getWorkScheduleList();
  }

  openWorkGroupDrawer() {
    this.drawer.workGroup.visible = true;
  }

  closeWorkGroupDrawer() {
    this.drawer.workGroup.visible = false;
  }

  newWorkGroup(): void {
    this.openWorkGroupDrawer();

    setTimeout(() => {
      this.workGroupForm().newForm();
    },50);
  }

  modifyWorkGroup(workGroup: any): void {
    this.openWorkGroupDrawer();

    setTimeout(() => {
      this.workGroupForm().get(workGroup.id);
    },50);
  }

  newSchedule(): void {
    this.openScheduleDrawer();

    const today: Date = new Date();
    const from: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0);
    const to: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 1, 0);
    this.newScheduleArgs = {workCalendarId: this.drawer.workGroup.selectedWorkGroupId, start: from, end: to};
    this.drawer.schedule.selectedScheduleId = -1;
  }

  newScheduleByDateSelect(param: NewDateSelectedArgs) {
    console.log('newScheduleByDateSelect: start');
    if (param.workCalendarId === -1) {
      alert('CALENDAR를 선택해주세요.');
      return;
    }

    console.log(param);

    this.navigator().date = new DayPilot.Date(param.start, true);
    this.newScheduleArgs = {workCalendarId: this.drawer.workGroup.selectedWorkGroupId, start: param.start, end: param.end};
    this.drawer.schedule.selectedScheduleId = -1;

    this.openScheduleDrawer();
    console.log('newScheduleByDateSelect: end');
  }

  editSchedule(id: any) {
    this.drawer.schedule.selectedScheduleId = id;
    this.newScheduleArgs = undefined;

    this.openScheduleDrawer();
  }

  workGroupSelect(ids: any): void {
    this.drawer.workGroup.selectedWorkGroupId = ids;
    this.getScheduleList();
  }

  eventDateChanged(event: any) {
    this.eventData = event;
  }

  calendarVisibleRangeChanged(params: any) {
    /*
    if (this.mode === 'Month') {
      this.navigator.date = new DayPilot.Date(params.date, true);
    } else {
      this.navigator.date = new DayPilot.Date(params.start, true);
    }
    */
  }

  modeChanged(params: ModeChangedArgs): void {
    this.mode = params.mode;
  }

  navigatorSelectChanged(params: any) {
    this.workCalendar().calendarSetDate(new DayPilot.Date(params.start, true));
  }

}
