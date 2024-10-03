import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';
import { ResponseList } from 'src/app/core/model/response-list';

import { Company } from './company.model';
import { CompanyGridService } from './company-grid.service';
import { RowSelectionOptions } from 'ag-grid-community';


@Component({
  selector: 'app-company-grid',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule
  ],
  template: `
    <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="rowSelection"
      [rowData]="_list"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDoubleClickedFunc($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class CompanyGridComponent extends AggridFunction implements OnInit {

  _list: Company[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private service = inject(CompanyGridService);
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
        width: 70,
        cellStyle: {'text-align': 'center'}
      },
      { headerName: '회사코드',       field: 'companyCode',                 width: 80 },
      { headerName: '회사명',         field: 'companyName',                 width: 100 },
      { headerName: '사업자등록번호',  field: 'businessRegistrationNumber',  width: 120 },
      { headerName: '법인번호',       field: 'coporationNumber',            width: 100 },
      { headerName: '대표자',         field: 'nameOfRepresentative',        width: 100 },
      { headerName: '설립일',         field: 'establishmentDate',           width: 100 }
    ];

    this.getRowId = (params: any) => {
        return params.data.companyCode;
    };
  }

  getList(): void {

    this.service
        .getList()
        .subscribe(
          (model: ResponseList<Company>) => {
              if (model.data) {
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

