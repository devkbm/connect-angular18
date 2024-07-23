import { Component, OnInit, viewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';

import { BizCodeTypeGridComponent } from './biz-code-type-grid.component';
import { BizCodeGridComponent } from './biz-code-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { BizCodeFormComponent } from './biz-code-form.component';
import { BizCodeTypeFormComponent } from './biz-code-type-form.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';

@Component({
  selector: 'app-biz-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    BizCodeTypeGridComponent,
    BizCodeGridComponent,
    BizCodeTypeFormComponent,
    BizCodeFormComponent
  ],
  template: `
<div class="page-header">
  <app-nz-page-header-custom title="업무코드 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>
</div>

<app-nz-search-area [height]="'var(--page-search-height)'">
  <div nz-row>
    <div nz-col [nzSpan]="24" class="text-align-right">
      <button nz-button (click)="selectBizCodeTypeList()">
        <span nz-icon nzType="search" nzTheme="outline"></span>조회
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="newCodeType()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규 분류
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="newCode()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규 코드
      </button>
    </div>
  </div>
</app-nz-search-area>


<div class="page-content">
  <h3 class="header1">업무코드분류</h3>
  <app-biz-type-grid
    (rowClicked)="codeTypeGridRowClicked($event)"
    (editButtonClicked)="editCodeType($event)"
    (rowDoubleClicked)="editCodeType($event)">
  </app-biz-type-grid>

  <h3 class="header2">업무코드</h3>
  <app-biz-code-grid
    (rowClicked)="codeGridRowClicked($event)"
    (editButtonClicked)="editCode($event)"
    (rowDoubleClicked)="editCode($event)">
  </app-biz-code-grid>
</div>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    nzWidth="80%"
    [nzVisible]="drawer.codeType.visible"
    nzTitle="업무코드분류 등록"
    (nzOnClose)="drawer.codeType.visible = false">
    <app-biz-code-type-form *nzDrawerContent
        [initLoadId]="drawer.codeType.initLoadId"
        (formSaved)="selectBizCodeTypeList()"
        (formDeleted)="selectBizCodeTypeList()"
        (formClosed)="drawer.codeType.visible = false">
    </app-biz-code-type-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    nzWidth="80%"
    [nzVisible]="drawer.code.visible"
    nzTitle="업무코드 등록"
    (nzOnClose)="drawer.code.visible = false">
    <app-biz-code-form *nzDrawerContent
        [initLoadId]="drawer.code.initLoadId"
        (formSaved)="selectBizCodeList()"
        (formDeleted)="selectBizCodeList()"
        (formClosed)="drawer.code.visible = false">
    </app-biz-code-form>
</nz-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
  --page-content-title-height: 26px;
  --page-content-title-margin-height: 6px;
  --page-content-margin-height: 6px;
}

.page-header {
  height: var(--page-header-height);
}

.page-search {
  height: var(--page-search-height);
}

.page-content-title {
  height: var(--page-content-title-height);
}

.grid-title {
  margin-top: var(--page-content-title-margin-height);
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.page-content {
  margin-top: var(--page-content-margin-height);
  height: calc(100vh - (
                        var(--app-header-height) +
                        var(--app-footer-height) +
                        var(--page-header-height) +
                        var(--page-search-height) +
                        /*var(--page-content-title-height) +
                        var(--page-content-title-margin-height) +*/
                        var(--page-content-margin-height)
                       )
              );
  display: grid;
  grid-template-rows: 34px 1fr;
  grid-template-columns: 1fr 1fr;
  column-gap: 12px;
  grid-template-areas:
    "header1 header2"
    "grid1   grid2";
}

.text-align-right {
  text-align: right;
}

.header1 {
  grid-area: header1;
  margin-top: var(--page-content-title-margin-height);
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.header2 {
  grid-area: header2;
  margin-top: var(--page-content-title-margin-height);
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.grid1 {
  grid-area: grid1;
}

.grid2 {
  grid-area: grid2;
}

.footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 10px 16px;
  text-align: right;
  left: 0px;
  /*background: #fff;*/
}
  `
})
export class BizCodeComponent extends AppBase implements OnInit {

  gridCodeType = viewChild.required(BizCodeTypeGridComponent);
  gridCode = viewChild.required(BizCodeGridComponent);

  drawer: {
    codeType: { visible: boolean, initLoadId: any },
    code: { visible: boolean, initLoadId: any }
  } = {
    codeType: { visible: false, initLoadId: null },
    code: { visible: false, initLoadId: null }
  }

  ngOnInit(): void {
  }

  selectBizCodeTypeList() {
    this.drawer.codeType.visible = false;

    this.gridCodeType().getList();
  }

  newCodeType() {
    this.drawer.codeType.initLoadId = null;
    this.drawer.codeType.visible = true;
  }

  editCodeType(params: any) {
    this.drawer.codeType.initLoadId = params.typeId;
    this.drawer.codeType.visible = true;
  }

  codeTypeGridRowClicked(params: any) {
    this.drawer.codeType.initLoadId = params.typeId;
    this.drawer.code.initLoadId = {typeId: params.typeId};

    this.gridCode().getList(this.drawer.code.initLoadId.typeId);
  }

  selectBizCodeList() {
    this.drawer.code.visible = false;
    this.gridCode().getList(this.drawer.code.initLoadId.typeId);
  }

  newCode() {
    this.drawer.code.visible = true;
  }

  editCode(params: any) {
    this.drawer.code.initLoadId = {typeId: params.typeId, code: params.code};
    this.drawer.code.visible = true;
  }

  codeGridRowClicked(params: any) {
    this.drawer.code.initLoadId = {typeId: params.typeId, code: params.code};
  }

}
