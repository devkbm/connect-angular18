import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { RowSelectionOptions } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { WebResourceService } from './web-resource.service';
import { WebResource } from './web-resource.model';

@Component({
  selector: 'app-web-resource-grid',
  standalone: true,
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      class="ag-theme-balham-dark"
      [rowData]="_list"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: [`
    nz-spin {
      height:100%
    }
    /** nz-spin component 하위 엘리먼트 크기 조정 */
    :host .ant-spin-container.ng-star-inserted {
      height: 100%;
    }

    ag-grid-angular {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `]
})
export class WebResourceGridComponent {

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

  isLoading: boolean = false;
  _list: WebResource[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private service = inject(WebResourceService);
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
    { headerName: '리소스ID',     field: 'resourceId',      width: 150 },
    { headerName: '리소스명',     field: 'resourceName',    width: 200 },
    { headerName: '리소스타입',   field: 'resourceType',    width: 200 },
    { headerName: 'Url',          field: 'url',             width: 200 },
    { headerName: '설명',         field: 'description',     width: 300 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.resourceId;
  };

  constructor() {
    this.getList();
  }

  public getList(params?: any): void {
    this.isLoading = true;
    this.service
        .getList(params)
        .subscribe(
          (model: ResponseList<WebResource>) => {
            this._list = model.data;
            this.isLoading = false;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  rowClickedEvent(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

}
