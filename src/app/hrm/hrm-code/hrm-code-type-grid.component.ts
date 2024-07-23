import { Component, OnInit, Output, EventEmitter, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { AggridFunction } from 'src/app/core/grid/aggrid-function';

import { HrmType } from './hrm-type.model';

import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  standalone: true,
  selector: 'app-hrm-code-type-grid',
  imports: [CommonModule, AgGridModule],
  template: `
    <ag-grid-angular
        [ngStyle]="style"
        class="ag-theme-balham-dark"
        [rowSelection]="'single'"
        [rowData]="list"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [getRowId]="getRowId"
        (gridReady)="onGridReady($event)"
        (selectionChanged)="selectionChanged($event)"
        (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class HrmCodeTypeGridComponent extends AggridFunction implements OnInit {

  @Input() list: HrmType[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

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
      { headerName: '분류ID',       field: 'typeId',          width: 150 },
      { headerName: '분류명',       field: 'typeName',        width: 200 },
      { headerName: '설명',         field: 'comment',         width: 200 },
      { headerName: '순번',         field: 'sequence',        width: 80 }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(params: any) {
      return params.data.typeId;
    };
  }

  onEditButtonClick(e: any) {
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
