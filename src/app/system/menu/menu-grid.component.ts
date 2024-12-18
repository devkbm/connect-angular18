import { Component, OnInit, Input, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { RowSelectionOptions } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { MenuService } from './menu.service';
import { Menu } from './menu.model';


@Component({
  selector: 'app-menu-grid',
  standalone: true,
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      class="ag-theme-balham-dark"
      [rowData]="menuList"
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
export class MenuGridComponent implements OnInit {

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

  menuList: Menu[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  @Input() menuGroupCode: string = '';

  private menuService = inject(MenuService);
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
      width: 50,
      cellStyle: {'text-align': 'center'}
    },
    {headerName: '메뉴그룹코드',  field: 'menuGroupCode',   width: 100 },
    {headerName: '메뉴코드',      field: 'menuCode',        width: 80},
    {headerName: '메뉴명',        field: 'menuName',        width: 130},
    {headerName: '메뉴타입',      field: 'menuType',        width: 100 },
    {headerName: '상위메뉴코드',  field: 'parentMenuCode',  width: 100 },
    {headerName: '순번',          field: 'sequence',        width: 60},
    {headerName: 'APP URL',       field: 'appUrl',          width: 300 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
      return params.data.menuGroupCode + params.data.menuCode;
  };

  ngOnInit() {
  }

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  getMenuList(params?: any) {

    this.menuService
        .getMenuList(params)
        .subscribe(
          (model: ResponseList<Menu>) => {
            this.menuList = model.data;
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
}
