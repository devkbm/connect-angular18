import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { RowSelectionOptions } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { CommonCodeService } from './common-code.service';
import { CommonCode } from './common-code.model';

@Component({
  selector: 'app-common-code-grid',
  standalone: true,
  imports: [ CommonModule, AgGridModule ],
  template: `
    <ag-grid-angular
      class="ag-theme-balham-dark"
      [rowData]="commonCodeList"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
  </ag-grid-angular>
  `
})
export class CommonCodeGridComponent implements OnInit {

  //#region Ag-grid Api
  gridApi: any;
  gridColumnApi: any;

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getSelectedRows() {
    return this.gridApi.getSelectedRows();
  }
  //#endregion

  commonCodeList: CommonCode[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private commonCodeService = inject(CommonCodeService);
  private appAlarmService = inject(AppAlarmService);

  defaultColDef: ColDef = { sortable: true, resizable: true };

  columnDefs: ColDef[] = [
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
    { headerName: 'ID',            field: 'id',                    width: 150 },
    { headerName: '공통코드',      field: 'code',                  width: 200 },
    { headerName: '공통코드명',    field: 'codeName',              width: 200 },
    { headerName: '약어',          field: 'codeNameAbbreviation',  width: 200 },
    {
      headerName: '시작일',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'fromDate',
      width: 200
    },
    {
      headerName: '종료일',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'toDate',
      width: 200
    },
    { headerName: 'Url',           field: 'url',                   width: 200 },
    { headerName: '설명',          field: 'cmt',                   width: 300 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };

  ngOnInit(): void {
    this.getCommonCodeList();
  }

  getCommonCodeList(params?: any): void {
    this.commonCodeService
        .getCodeList(params)
        .subscribe(
          (model: ResponseList<CommonCode>) => {
            this.commonCodeList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any): void {
    this.rowDoubleClicked.emit(event.data);
  }

  private onEditButtonClick(e: any): void {
    this.editButtonClicked.emit(e.rowData);
  }

}
