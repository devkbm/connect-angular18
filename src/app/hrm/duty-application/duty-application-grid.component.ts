
import { Component, OnInit, inject, output } from '@angular/core';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { DutyApplicationService } from './duty-application.service';
import { DutyApplication } from './duty-application.model';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  standalone: true,
  selector: 'app-duty-application-grid',
  imports: [CommonModule, AgGridModule],
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
  styles: [`
  `]
})
export class DutyApplicationGridComponent extends AggridFunction implements OnInit {

  _list: DutyApplication[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private dutyApplicationService = inject(DutyApplicationService);

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
      { headerName: '근태신청ID',         field: 'dutyId',              width: 150 },
      { headerName: '사원번호',           field: 'staffId',             width: 80 },
      { headerName: '근태코드',           field: 'dutyCode',            width: 80 },
      { headerName: '근태사유',           field: 'dutyReason',          width: 80 },
      { headerName: '근태시작일시',       field: 'dutyStartDateTime',   width: 80 },
      { headerName: '근태근태종료일시',   field: 'dutyEndDateTime',     width: 80 }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };

    this.getRowId = function(params: any) {
      return params.data.dutyId;
    };

    this.getGridList('');
  }

  public getGridList(typeId: string): void {
    const params = {
      dutyCode : typeId
    };

    this.dutyApplicationService
        .getList(params)
        .subscribe(
          (model: ResponseList<DutyApplication>) => {
            if (model?.total > 0) {
              this._list = model.data;
            } else {
              this._list = [];
            }
            this.appAlarmService.changeMessage(model?.message);
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

