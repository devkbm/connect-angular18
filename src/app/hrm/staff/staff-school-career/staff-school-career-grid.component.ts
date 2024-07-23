import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, output } from '@angular/core';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffSchoolCareerService } from './staff-school-career.service';
import { StaffSchoolCareer } from './staff-school-career.model';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  selector: 'app-staff-school-career-grid',
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
export class StaffSchoolCareerGridComponent extends AggridFunction implements OnInit, OnChanges {

  protected _list: StaffSchoolCareer[] = [];

  @Input() staffId?: string;

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private service = inject(StaffSchoolCareerService);

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
      { headerName: '학력',           field: 'schoolCareerTypeName',  width: 100 },
      { headerName: '학교',           field: 'schoolCodeName',        width: 150 },
      { headerName: '입학일',         field: 'fromDate',          width: 90 },
      { headerName: '졸업일',         field: 'toDate',            width: 90 },
      { headerName: '전공',           field: 'majorName',         width: 100 },
      { headerName: '부전공',         field: 'pluralMajorName',   width: 100 },
      { headerName: '지역',           field: 'location',          width: 100 },
      { headerName: '수업연한',       field: 'lessonYear',        width: 100 },
      { headerName: '비고',           field: 'comment',           width: 200 }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(params: any) {
      return params.data.staffId + params.data.seq;
    };
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
          (model: ResponseList<StaffSchoolCareer>) => {
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
