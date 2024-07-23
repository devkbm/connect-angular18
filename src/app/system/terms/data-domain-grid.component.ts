import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { Component, OnInit, inject, output } from '@angular/core';

import { ResponseList } from 'src/app/core/model/response-list';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { DataDomainService } from './data-domain.service';
import { DataDomain } from './data-domain.model';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  selector: 'app-data-domain-grid',
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
export class DataDomainGridComponent extends AggridFunction implements OnInit {

  list: DataDomain[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private service = inject(DataDomainService);
  private appAlarmService = inject(AppAlarmService);

  ngOnInit() {
    this.defaultColDef = { resizable: true, sortable: true };

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
      /*{headerName: '도메인ID',      field: 'domainId',      width: 100 },*/
      {headerName: '데이터베이스',  field: 'database',      width: 100 },
      {headerName: '도메인',        field: 'domainName',    width: 100 },
      {headerName: '데이터타입',    field: 'dataType',      width: 150 },
      {headerName: '비고',          field: 'comment',       width: 400 }
    ];

    this.getRowId = function(params: any) {
      return params.data.domainId;
    };

    this.getList();
  }

  getList(params?: any) {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<DataDomain>) => {
            if (model.total > 0) {
              this.list = model.data;
            } else {
              this.list = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  rowClickedFunc(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClickedFunc(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

}
