import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, inject, output } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { ResponseList } from 'src/app/core/model/response-list';

import { FirstDataRenderedEvent, GridSizeChangedEvent, RowClickedEvent, RowDoubleClickedEvent, SelectionChangedEvent } from 'ag-grid-community';

import { ArticleService } from './article.service';
import { Article } from './article.model';
import { ButtonRendererComponent } from 'src/app/core/grid/renderer/button-renderer.component';

@Component({
  standalone: true,
  selector: 'app-article-grid',
  imports: [
    CommonModule, AgGridModule
  ],
  template: `
    <ag-grid-angular
      [ngStyle]="style"
      class="ag-theme-balham-dark"
      [rowSelection]="'single'"
      [rowData]="articleList"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridSizeChanged)="onGridSizeChanged($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class ArticleGridComponent extends AggridFunction implements OnInit {

  articleList: Article[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private boardService = inject(ArticleService);

  ngOnInit() {
    this.columnDefs = [
      {
          headerName: '번호',
          //valueGetter: 'node.rowIndex + 1',
          field: 'articleId',
          width: 70,
          cellStyle: {'text-align': 'center'},
          suppressSizeToFit: true
      },
      {
          headerName: '제목',
          field: 'title'
      },
      {
        headerName: '등록일자',
        cellRenderer: (data: any) => {
          return new Date(data.value).toLocaleString();
        },
        field: 'createdDt',
        width: 210,
        cellStyle: {'text-align': 'center'},
        suppressSizeToFit: true
      },
      {
        headerName: '수정일자',
        cellRenderer: (data: any) => {
          return new Date(data.value).toLocaleString();
        },
        field: 'modifiedDt',
        width: 210,
        cellStyle: {'text-align': 'center'},
        suppressSizeToFit: true
      },
      {
        headerName: '',
        width: 34,
        cellStyle: {'text-align': 'center', 'padding': '0px'},
        cellRenderer: ButtonRendererComponent,
        cellRendererParams: {
          onClick: this.onEditButtonClick.bind(this),
          label: '',
          iconType: 'form'
        },
        suppressSizeToFit: true
      }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true,
    };

    this.getRowId = function(params: any) {
      return params.data.articleId;
    };

    //this.setWidthAndHeight('100%', '100%');
  }

  getArticleList(fkBoard: any): void {
    this.boardService
        .getArticleList(fkBoard)
        .subscribe(
          (model: ResponseList<Article>) => {
            if (model.total > 0) {
              this.articleList = model.data;
              // this.sizeToFit();
            } else {
              this.articleList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedEvent(params: RowClickedEvent) {
    const selectedRows = params.api.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(params: RowDoubleClickedEvent) {
    this.rowDoubleClicked.emit(params.data);
  }

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    /*
    var gridWidth = document.getElementById("grid-wrapper").offsetWidth;
    var columnsToShow = [];
    var columnsToHide = [];
    var totalColsWidth = 0;
    var allColumns = this.gridColumnApi.getAllColumns();

    for (var i = 0; i < allColumns.length; i++) {
      let column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    */
        /*
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
    */

    //this.gridColumnApi.setColumnsVisible(columnsToShow, true);
    //this.gridColumnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

}
