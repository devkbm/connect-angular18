import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject, output } from '@angular/core';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffLicenseService } from './staff-license.service';
import { StaffLicense } from './staff-license.model';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  selector: 'app-staff-license-grid',
  standalone: true,
  imports: [
    CommonModule, AgGridModule
  ],
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
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class StaffLicenseGridComponent extends AggridFunction implements OnInit, OnChanges {

  protected _list: StaffLicense[] = [];

  @Input() staffId?: string;

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private service = inject(StaffLicenseService);

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
      { headerName: '자격면허',       field: 'licenseTypeName',         width: 90 },
      { headerName: '자격면허번호',   field: 'licenseNumber',           width: 150 },
      { headerName: '취득일',         field: 'dateOfAcquisition',       width: 200 },
      { headerName: '인증기관',       field: 'certificationAuthority',  width: 100 },
      { headerName: '비고',           field: 'comment',                 width: 100 }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(params: any) {
      return params.data.staffId + params.data.seq;
    };

    //this.setWidthAndHeight('100%', '600px');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffId'].currentValue) {
      this.getList(changes['staffId'].currentValue);
    }
  }

  getList(staffId: string): void {
    this.service
        .getList(staffId)
        .subscribe(
          (model: ResponseList<StaffLicense>) => {
              if (model.total > 0) {
                this._list = model.data;
              } else {
                this._list = [];
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

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }
}
