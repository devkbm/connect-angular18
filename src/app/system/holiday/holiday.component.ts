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

import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { CalendarDaypilotNavigatorComponent } from 'src/app/third-party/daypilot/calendar-daypilot-navigator.component';

import { HolidayCalendarComponent } from "./holiday-calendar.component";
import { ShapeComponent } from "../../core/app/shape.component";

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
    CalendarDaypilotNavigatorComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="공휴일 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
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
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">공휴일 목록</h3>
    </div>

    <div class="grid-wrapper">
    <!--
      <app-holiday-calendar>
      </app-holiday-calendar>
    -->
      @defer {
      <app-calendar-daypilot-navigator
        [events]="grid().filteredList()"
        (selectChanged)="navigatorSelectChanged($event)">
      </app-calendar-daypilot-navigator>
      }
      <!--{{holidayGrid.filteredList() | json}}-->
      @defer {
      <app-holiday-grid
          #holidayGrid
          (rowClicked)="holidayGridRowClicked($event)"
          (editButtonClicked)="edit($event)"
          (rowDoubleClicked)="edit($event)">
      </app-holiday-grid>
      }
    </div>
  </div>
</app-shape>

<app-holiday-form-drawer
  [drawer]="drawer.holiday"
  (drawerClosed)="getHolidayList()">
</app-holiday-form-drawer>

  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.grid-title {
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.grid-wrapper {
  height: 100%;
  display: grid;
  grid-template-columns: 200px 1fr;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
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
