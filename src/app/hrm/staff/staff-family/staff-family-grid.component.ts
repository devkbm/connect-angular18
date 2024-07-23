import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, output } from '@angular/core';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { StaffFamily } from './staff-family.model';
import { StaffFamilyService } from './staff-family.service';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  selector: 'app-staff-family-grid',
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
export class StaffFamilyGridComponent extends AggridFunction implements OnInit, OnChanges {

  protected _list: StaffFamily[] = [];

  @Input() staffId?: string;

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private service = inject(StaffFamilyService);

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
      { headerName: '가족관계',       field: 'familyRelationName',  width: 90 },
      { headerName: '가족명',         field: 'familyName',          width: 90 },
      { headerName: '가족주민번호',   field: 'familyRRN',           width: 150 },
      { headerName: '직업',           field: 'occupation',          width: 100 },
      { headerName: '학력',           field: 'schoolCareerType',    width: 100 },
      { headerName: '비고',           field: 'comment',             width: 200 }
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
          (model: ResponseList<StaffFamily>) => {
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
