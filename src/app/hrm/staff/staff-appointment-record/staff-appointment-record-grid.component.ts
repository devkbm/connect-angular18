import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, output } from '@angular/core';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { StaffAppointmentRecordService } from './staff-appointment-record.service';

import { StaffAppointmentRecord } from './staff-appointment-record.model';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';


@Component({
  selector: 'app-staff-appointment-record-grid',
  standalone: true,
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="'single'"
      [rowData]="_list"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class StaffAppointmentRecordGridComponent extends AggridFunction implements OnInit, OnChanges {

  protected _list: StaffAppointmentRecord[] = [];

  @Input() staffNo?: string;

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private service = inject(StaffAppointmentRecordService);

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: '',
        width: 34,
        cellStyle: {'text-align': 'center', 'padding': '0px'},
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
      { headerName: '발령분류',       field: 'appointmentTypeName',     width: 90 },
      { headerName: '발령일',         field: 'appointmentDate',         width: 90 },
      { headerName: '발령종료일',     field: 'appointmentEndDate',      width: 90 },
      { headerName: '발령기록',       field: 'recordName',              width: 200 },
      { headerName: '소속부서',       field: 'blngDeptName',            width: 100 },
      { headerName: '근무부서',       field: 'workDeptName',            width: 100 },
      { headerName: '직군',           field: 'jobGroupName',            width: 80 },
      { headerName: '직위',           field: 'jobPositionName',         width: 80 },
      { headerName: '직종',           field: 'occupationName',          width: 80 },
      { headerName: '직급',           field: 'jobGradeName',            width: 80 },
      { headerName: '호봉',           field: 'payStepName',             width: 80 },
      { headerName: '직무',           field: 'jobName',                 width: 80 },
      { headerName: '직책',           field: 'dutyResponsibilityName',  width: 80 },
      { headerName: '비고',           field: 'comment',                 width: 80 }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(params: any) {
      return params.data.seq;
    };

    //this.setWidthAndHeight('100%', '600px');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffNo']) {
      this.getList(changes['staffNo'].currentValue);
    }
  }

  getList(staffNo: string): void {
    this.service
        .getList(staffNo)
        .subscribe(
          (model: ResponseList<StaffAppointmentRecord>) => {
              if (model.total > 0) {
                this._list = model.data;
              } else {
                this._list = [];
              }
              this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }
}
