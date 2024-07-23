import { Component, OnInit, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { HrmCode } from './hrm-code.model';

import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/core/grid/renderer/checkbox-renderer.component';

@Component({
  selector: 'app-hrm-code-grid',
  standalone: true,
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
export class HrmCodeGridComponent extends AggridFunction implements OnInit {

  @Input() list: HrmCode[] = [];

  @Input() appointmentCode: any = '';

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

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(params: any) {
      return params.data.typeId + params.data.code;
    };
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
