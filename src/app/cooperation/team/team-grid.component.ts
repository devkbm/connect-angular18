import { Component, OnInit, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { AggridFunction } from 'src/app/core/grid/aggrid-function';

import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

import { TeamModel } from './team.model';

@Component({
  standalone: true,
  selector: 'app-team-grid',
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
export class TeamGridComponent extends AggridFunction implements OnInit {

  @Input() list: TeamModel[] = [];

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
      { headerName: '팀ID',       field: 'teamId',      width: 150, filter: 'agTextColumnFilter' },
      { headerName: '팀명',       field: 'teamName',    width: 200, filter: 'agTextColumnFilter' }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(params: any) {
      return params.data.teamId;
    };
  }



  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

}
