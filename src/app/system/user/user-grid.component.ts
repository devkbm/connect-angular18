import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { Component, OnInit, Output, EventEmitter, inject, output } from '@angular/core';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { ResponseList } from 'src/app/core/model/response-list';

import { UserService } from './user.service';
import { User } from './user.model';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/core/grid/renderer/checkbox-renderer.component';


@Component({
  selector: 'app-user-grid',
  standalone: true,
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="'single'"
      [rowData]="userList"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
  </ag-grid-angular>
  `
})
export class UserGridComponent extends AggridFunction implements OnInit {

  userList: User[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private userService = inject(UserService);
  private appAlarmService = inject(AppAlarmService);

  ngOnInit() {
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
      { headerName: '아이디',        field: 'userId',    width: 100 },
      { headerName: '이름',          field: 'name',      width: 100 },
      { headerName: '부서',          field: 'deptName',  width: 100 },
      { headerName: '핸드폰번호',    field: 'mobileNum', width: 100 },
      { headerName: '이메일',        field: 'email',     width: 100 },
      {
        headerName: '사용여부',
        field: 'enabled',
        width: 80,
        cellStyle: {'text-align': 'center', padding: '0px'},
        cellRenderer: CheckboxRendererComponent,
        cellRendererParams: {
          label: '',
          disabled: true
        }
      },
      {
        headerName: '계정잠금여부',
        field: 'accountNonLocked',
        width: 120,
        cellStyle: {'text-align': 'center', padding: '0px'},
        cellRenderer: CheckboxRendererComponent,
        cellRendererParams: {
          label: '',
          disabled: true
        }
      },
      {
        headerName: '계정만료여부',
        field: 'accountNonExpired',
        width: 120,
        cellStyle: {'text-align': 'center', padding: '0px'},
        cellRenderer:CheckboxRendererComponent,
        cellRendererParams: {
          label: '',
          disabled: true
        }
      },
      {
        headerName: '비번만료여부',
        field: 'credentialsNonExpired',
        width: 120,
        cellStyle: {'text-align': 'center', padding: '0px'},
        cellRenderer: CheckboxRendererComponent,
        cellRendererParams: {
          onClick: this.onEditButtonClick.bind(this),
          label: '',
          disabled: true
        }
      }
    ];

    this.getRowId = function(data: any) {
      return data.data.userId;
    };

    this.getUserList();
  }

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  getUserList(params?: any): void {

    this.userService
        .getUserList(params)
        .subscribe(
          (model: ResponseList<User>) => {
              if (model.total > 0) {
                  this.userList = model.data;
              } else {
                  this.userList = [];
              }
              this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  rowClickedEvent(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

  getSelectedRow() {
    return this.gridApi.getSelectedRows()[0];
  }

}
