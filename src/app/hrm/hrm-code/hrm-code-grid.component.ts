import { Component, OnInit, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { RowSelectionOptions } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/third-party/ag-grid/renderer/checkbox-renderer.component';

import { HrmCode } from './hrm-code.model';

@Component({
  selector: 'app-hrm-code-grid',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  template: `
    <ag-grid-angular
      class="ag-theme-balham-dark"
      [rowData]="list"
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
export class HrmCodeGridComponent implements OnInit {

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

  @Input() list: HrmCode[] = [];

  @Input() appointmentCode: any = '';

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

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
    { headerName: '코드',         field: 'code',        width: 150, filter: 'agTextColumnFilter' },
    { headerName: '코드명',       field: 'codeName',    width: 200, filter: 'agTextColumnFilter' },
    { headerName: '설명',         field: 'comment',     width: 200, filter: 'agTextColumnFilter' },
    {
      headerName: '사용여부',
      field: 'useYn',
      width: 80,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer: CheckboxRendererComponent,
      cellRendererParams: {
        label: '',
        disabled: true
      }
    },
    { headerName: '순번',         field: 'sequence',    width: 80,  filter: 'agNumberColumnFilter' }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.typeId + params.data.code;
  };

  ngOnInit() {

  }

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

}
