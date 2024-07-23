import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { Component, OnInit, Output, EventEmitter, inject, output } from '@angular/core';

import { ResponseList } from 'src/app/core/model/response-list';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { StaffService } from './staff.service';
import { Staff } from './staff.model';

@Component({
  selector: 'app-staff-grid',
  standalone: true,
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
   <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="'single'"
      [rowData]="list"
      [columnDefs]="columnDefs"
      [getRowId]="getRowId"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDbClickedFunc($event)">
  </ag-grid-angular>
  `,
  styles: []
})
export class StaffGridComponent extends AggridFunction implements OnInit {

  list: Staff[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private service = inject(StaffService);
  private appAlarmService = inject(AppAlarmService);

  ngOnInit() {
    this.defaultColDef = { resizable: true, sortable: true };

    this.columnDefs = [
      /*{
        headerName: '',
        width: 34,
        cellStyle: {'text-align': 'center', padding: '0px'},
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onEditButtonClick.bind(this),
          label: '',
          iconType: 'form'
        }
      },*/
      {
        headerName: '',
        valueGetter: 'node.rowIndex + 1',
        width: 38,
        cellStyle: {'text-align': 'center'}
      },
      {headerName: '직원번호',      field: 'staffNo',         width: 77},
      {headerName: '직원명',        field: 'name',            width: 75 }
      /*{headerName: '생년월일',      field: 'birthday',        width: 200 } */
    ];

    this.getRowId = function(params: any) {
      return params.data.companyCode + params.data.staffNo;
    };

    this.getList();
  }

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  getList(params?: any): void {
    this.service
        .getStaffList(params)
        .subscribe(
          (model: ResponseList<Staff>) => {
            if (model.total > 0) {
              this.list = model.data;
            } else {
              this.list = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedFunc(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClickedFunc(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

}
