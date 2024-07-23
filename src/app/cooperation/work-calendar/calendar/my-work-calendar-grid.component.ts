import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { WorkCalendarService } from './work-calendar.service';
import { WorkCalendar } from './work-calendar.model';


@Component({
  selector: 'app-my-work-calendar-grid',
  standalone: true,
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="'multiple'"
      [rowData]="workGroupList"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class MyWorkCalendarGridComponent extends AggridFunction implements OnInit {

  workGroupList: WorkCalendar[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private workGroupService = inject(WorkCalendarService);

  ngOnInit(): void {
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.columnDefs = [
      {
          headerName: 'No',
          valueGetter: 'node.rowIndex + 1',
          width: 40,
          cellStyle: {'text-align': 'center'},
          suppressSizeToFit: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true
      },
      {
          headerName: 'Id',
          field: 'id',
          width: 40,
          suppressSizeToFit: true,
          hide: true
      },
      {
        headerName: '',
        width: 10,
        suppressSizeToFit: true,
        cellStyle: (params: any) => {
          return {backgroundColor: params.data.color};
        }
      },
      {
        headerName: 'CALENDAR',
        field: 'name',
        width: 140
      }
    ];

    this.getRowId = (data: any) => {
        return data.data.id;
    };

    this.sizeToFit();
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
              this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    let ids = selectedRows.map((v: { id: any; }) => v.id)   // id 추출
                          .join(',');       // 콤마 구분자로 분리함
    this.rowClicked.emit(ids);
    // console.log('ids ' + ids);
  }

  rowDbClicked(event: any): void {
    this.rowDoubleClicked.emit(event.data);
  }

}
