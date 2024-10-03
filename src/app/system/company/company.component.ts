import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonTemplate, NzButtonsComponent } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
import { NzPageHeaderCustomComponent } from "src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component";
import { NzSearchAreaComponent } from "src/app/shared-component/nz-search-area/nz-search-area.component";

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { CompanyFormDrawerComponent } from "./company-form-drawer.component";

import { CompanyGridService } from './company-grid.service';
import { CompanyGridComponent } from './company-grid.component';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzButtonsComponent,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    CompanyGridComponent,
    CompanyFormDrawerComponent
],
  template: `
<nz-page-header-custom title="리소스 등록" subtitle="This is a subtitle"></nz-page-header-custom>

<app-nz-search-area [height]="'var(--page-search-height)'">
  <div nz-row>
    <div nz-col [nzSpan]="12">
      <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
        <ng-template #addOnBeforeTemplate>
          <nz-select [(ngModel)]="query.company.key">
            @for (option of query.company.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>
        </ng-template>
        <input type="text" [(ngModel)]="query.company.value" nz-input placeholder="input search text" (keyup.enter)="getList()">
        <ng-template #suffixIconSearch>
          <span nz-icon nzType="search"></span>
        </ng-template>
      </nz-input-group>
    </div>
    <div nz-col [nzSpan]="12" style="text-align: right;">
      <app-nz-buttons [buttons]="buttons"></app-nz-buttons>
    </div>
  </div>
</app-nz-search-area>

<h3 class="grid-title">회사 목록 {{drawer| json}} </h3>

<div class="grid-wrapper">
  <app-company-grid #grid
    (rowClicked)="resourceGridRowClicked($event)"
    (editButtonClicked)="editResource($event)"
    (rowDoubleClicked)="editResource($event)">
  </app-company-grid>
</div>

<app-company-form-drawer
  [drawer]="drawer.company"
  (drawerClosed)="getList()">
</app-company-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
  --page-content-title-height: 26px;
  --page-content-title-margin-height: 6px;
  --page-content-margin-height: 6px;
}

.grid-title {
  height: 26px;
  margin-top: 6px;
  margin-left: 6px;
  padding-left: 6px;
  border-left: 6px solid green;
  vertical-align: text-top;
}

/* 페이지 헤더 98px, 조회조건 46px, 그리드 제목 26px, 푸터 24px 제외 */
.grid-wrapper {
  height: calc(100% - 194px)
}
  `
})
export class CompanyComponent implements OnInit {

  private service = inject(CompanyGridService);

  grid = viewChild.required(CompanyGridComponent);

  query: {
    company : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    company : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '리소스코드', value: 'resourceCode'},
        {label: '리소스명', value: 'resourceName'},
        {label: 'URL', value: 'url'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  buttons: ButtonTemplate[] = [{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.newResource();
    }
  },{
    text: '삭제',
    nzType: 'delete',
    isDanger: true,
    popConfirm: {
      title: '삭제하시겠습니까?',
      confirmClick: () => {
        this.delete();
      }
    }
  }];

  drawer: {
    company: { visible: boolean, initLoadId: any }
  } = {
    company: { visible: false, initLoadId: null }
  }

  ngOnInit(): void {
  }

  getList(): void {
    let params: any = new Object();
    if ( this.query.company.value !== '') {
      params[this.query.company.key] = this.query.company.value;
    }

    this.drawer.company.visible = false;

    this.grid().getList();
  }

  newResource(): void {
    this.drawer.company.initLoadId = null;
    this.drawer.company.visible = true;
  }

  editResource(item: any): void {
    this.drawer.company.initLoadId = item.companyCode;
    this.drawer.company.visible = true;
  }

  delete(): void {

    const id = this.grid().getSelectedRows()[0].companyCode;
/*
    this.service
        .delete(id)
        .subscribe(
          (model: ResponseObject<Company>) => {
            this.getList();
          }
        );
*/
  }

  resourceGridRowClicked(item: any): void {
    this.drawer.company.initLoadId = item.companyCode;
  }

}
