import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { Holiday } from './holiday.model';
import { Component, OnInit, Output, EventEmitter, Input, inject, output } from '@angular/core';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { HolidayService } from './holiday.service';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  standalone: true,
  selector: 'app-holiday-grid',
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="'single'"
      [rowData]="gridList"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
  </ag-grid-angular>
  `
})
export class HolidayGridComponent extends AggridFunction implements OnInit {

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  gridList: Holiday[] = [];

  private appAlarmService = inject(AppAlarmService);
  private holidayService = inject(HolidayService);

  ngOnInit(): void {
    this.columnDefs = [
      {
        headerName: '',
        width: 34,
        cellStyle: {'text-align': 'center', padding: '0px'},
        cellRenderer: ButtonRendererComponent,
        cellRendererParams: {
          onClick: this.onEditButtonClick.bind(this),
          label: '',
          iconType: 'form'
        }
      },
      {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 70,
        cellStyle: {'text-align': 'center'}
      },
      { headerName: '일자',     field: 'date',                width: 110,   cellStyle: {'text-align': 'center'} },
      { headerName: '요일',     field: 'dayOfWeek',           width: 50,    cellStyle: {'text-align': 'center'} },
      { headerName: '휴일명',   field: 'holiday.holidayName', width: 150 },
      { headerName: '비고',     field: 'holiday.comment',     width: 200 }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = (params: any) => {
      return params.data.date;
    };

    //this.getGridList();
  }

  getGridList(fromDate: string, toDate: string): void {

    this.holidayService
        .getHolidayList(fromDate, toDate)
        .subscribe(
          (model: ResponseList<Holiday>) => {
            if (model.total > 0) {
              this.gridList = model.data;
            } else {
              this.gridList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  onEditButtonClick(e: any): void {
    this.editButtonClicked.emit(e.rowData);
  }

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any): void {
    this.rowDoubleClicked.emit(event.data);
  }

}
