import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { Component, OnInit, Output, EventEmitter, inject, output } from '@angular/core';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { ResponseList } from 'src/app/core/model/response-list';

import { MenuService } from './menu.service';
import { MenuGroup } from './menu-group.model';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';


@Component({
  standalone: true,
  selector: 'app-menu-group-grid',
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="'single'"
      [rowData]="menuGroupList"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
  </ag-grid-angular>
  `
})
export class MenuGroupGridComponent extends AggridFunction implements OnInit {

  menuGroupList: MenuGroup[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private menuService = inject(MenuService);
  private appAlarmService = inject(AppAlarmService);

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

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
        width: 50,
        cellStyle: {'text-align': 'center'}
      },
      {
        headerName: '메뉴그룹코드',
        field: 'menuGroupCode',
        width: 100,
        cellStyle: {'text-align': 'center'}
      },
      {
        headerName: '메뉴그룹명',
        field: 'menuGroupName',
        width: 120
      },
      {
        headerName: '메뉴그룹URL',
        field: 'menuGroupUrl',
        width: 150
      },
      {
        headerName: '설명',
        field: 'description',
        width: 300,
        headerClass: 'text-center'
      }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(data: any) {
        return data.data.menuGroupCode;
    };

    this.getMenuGroupList();
  }

  getMenuGroupList(params?: any): void {
    this.menuService
        .getMenuGroupList(params)
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
              if (model.total > 0) {
                  this.menuGroupList = model.data;
              } else {
                  this.menuGroupList = [];
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

}
