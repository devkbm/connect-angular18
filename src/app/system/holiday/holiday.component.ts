import { AfterViewInit, Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HolidayFormDrawerComponent } from './holiday-form-drawer.component';
import { HolidayGridComponent } from './holiday-grid.component';
import { HolidayService } from './holiday.service';
import { Holiday } from './holiday.model';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { HolidayCalendarComponent } from "./holiday-calendar.component";
import { CalendarDaypilotNavigatorComponent } from "../../shared-component/calendar/calendar-daypilot-navigator.component";


@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzDatePickerModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    HolidayGridComponent,
    HolidayFormDrawerComponent,
    HolidayCalendarComponent,
    CalendarDaypilotNavigatorComponent
],
  template: `
<div class="page-header">
  <nz-page-header-custom title="공휴일 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</div>

<app-nz-search-area [height]="'var(--page-search-height)'">
  <div nz-row>
    <div nz-col [nzSpan]="1" style="text-align: left;">
      <nz-date-picker nzMode="year" [(ngModel)]="query.holiday.year" nzAllowClear="false" (ngModelChange)="getHolidayList()" style="width: 80px;"></nz-date-picker>
    </div>

    <div nz-col [nzSpan]="23" style="text-align: right;">
      <button nz-button (click)="getHolidayList()">
        <span nz-icon nzType="search"></span>조회
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="newHoliday()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button nzDanger
        nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
        (nzOnConfirm)="deleteHoliday()" (nzOnCancel)="false">
        <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
      </button>
    </div>
  </div>
</app-nz-search-area>

<div class="page-content-title">
  <h3 class="grid-title">공휴일 목록</h3>
</div>

<div class="page-content grid-wrapper">
<!--
  <app-holiday-calendar>
  </app-holiday-calendar>
-->
  <app-calendar-daypilot-navigator
    [events]="holidayGrid.filteredList()"
    (selectChanged)="navigatorSelectChanged($event)">
  </app-calendar-daypilot-navigator>
  <!--{{holidayGrid.filteredList() | json}}-->
  <app-holiday-grid
      #holidayGrid
      (rowClicked)="holidayGridRowClicked($event)"
      (editButtonClicked)="edit($event)"
      (rowDoubleClicked)="edit($event)">
  </app-holiday-grid>

</div>

<app-holiday-form-drawer
  [drawer]="drawer.holiday"
  (drawerClosed)="getHolidayList()">
</app-holiday-form-drawer>

  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
  --page-content-title-height: 26px;
  --page-content-title-margin-height: 6px;
  --page-content-margin-height: 6px;
}

.page-header {
  height: var(--page-header-height);
}

.page-search {
  height: var(--page-search-height);
}

.page-content-title {
  height: var(--page-content-title-height);
}

.grid-title {
  margin-top: var(--page-content-title-margin-height);
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.page-content {
  margin-top: var(--page-content-margin-height);
  height: calc(100vh - (
                        var(--app-header-height) +
                        var(--app-footer-height) +
                        var(--page-header-height) +
                        var(--page-search-height) +
                        var(--page-content-title-height) +
                        var(--page-content-title-margin-height) +
                        var(--page-content-margin-height)
                       )
              );
}

.grid-wrapper {
  display: grid;
  grid-template-columns: 200px 1fr;
}

  `
})
export class HolidayComponent implements OnInit, AfterViewInit {

  private service = inject(HolidayService);
  private appAlarmService = inject(AppAlarmService);

  grid = viewChild.required(HolidayGridComponent);

  query: {
    holiday : { key: string, value: string, list: {label: string, value: string}[], year: Date },
  } = {
    holiday : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '휴일명', value: 'resourceCode'},
        {label: '비고', value: 'description'}
      ],
      year: new Date()
    }
  }

  drawer: {
    holiday: { visible: boolean, initLoadId: any }
  } = {
    holiday: { visible: false, initLoadId: null }
  }

  ngAfterViewInit(): void {
    this.getHolidayList();
  }

  ngOnInit(): void {
  }

  openDrawer(): void {
    this.drawer.holiday.visible = true;
  }

  closeDrawer(): void {
    this.drawer.holiday.visible = false;
  }

  getHolidayList(): void {
    let params: any = new Object();
    if ( this.query.holiday.value !== '') {
      params[this.query.holiday.key] = this.query.holiday.value;
    }

    const date: Date = this.query.holiday.year;

    this.closeDrawer();
    this.grid().getGridList(date.getFullYear()+'0101', date.getFullYear()+'1231');
  }

  newHoliday(): void {
    this.drawer.holiday.initLoadId = null;
    this.openDrawer();
  }

  deleteHoliday(): void {
    const date = this.grid().getSelectedRows()[0].date;
    this.delete(date);
  }

  delete(date: Date): void {
    const id = formatDate(date, 'yyyyMMdd','ko-kr') as string;
    if (id === null) return;

    this.service
        .deleteHoliday(id)
        .subscribe(
          (model: ResponseObject<Holiday>) => {
            this.appAlarmService.changeMessage(model.message);
            this.getHolidayList();
          }
        );
  }

  holidayGridRowClicked(item: any): void {
    this.drawer.holiday.initLoadId = item.date;
  }

  edit(item: any): void {
    this.drawer.holiday.initLoadId = item.date;
    this.openDrawer();
  }

  navigatorSelectChanged(params: any) {
    //console.log(params);
    //console.log(params.start.value as Date);
    this.drawer.holiday.initLoadId = params.start.value as Date;
    this.openDrawer();
  }
}
