import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { Component, OnInit, Output, EventEmitter, inject, output } from '@angular/core';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { ResponseList } from 'src/app/core/model/response-list';

import { BizCodeType } from './biz-code-type.model';
import { BizCodeTypeService } from './biz-code-type.service';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  selector: 'app-biz-type-grid',
  standalone: true,
  imports: [ CommonModule, AgGridModule ],
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
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDoubleClickedFunc($event)">
    </ag-grid-angular>
  `
})
export class BizCodeTypeGridComponent extends AggridFunction implements OnInit {

  _list: BizCodeType[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private service = inject(BizCodeTypeService);
  private appAlarmService = inject(AppAlarmService);

  ngOnInit(): void {
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
        width: 65,
        cellStyle: {'text-align': 'center'}
      },
      { headerName: '시스템',       field: 'bizType',       width: 80 },
      { headerName: '분류ID',       field: 'typeId',        width: 100 },
      { headerName: '분류명',       field: 'typeName',      width: 200 },
      { headerName: '순번',         field: 'sequence',      width: 50 },
      { headerName: '비고',         field: 'comment',       width: 400 }
    ];

    this.getRowId = (params: any) => {
      return params.data.typeId;
    };

    this.getList();
  }

  getList(): void {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<BizCodeType>) => {
            if (model.total > 0) {
              this._list = model.data;
            } else {
              this._list = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );

  }

  rowClickedFunc(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  rowDoubleClickedFunc(event: any): void {
    this.rowDoubleClicked.emit(event.data);
  }

  onEditButtonClick(e: any): void {
    this.editButtonClicked.emit(e.rowData);
  }

}
