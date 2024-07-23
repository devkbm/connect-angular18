import { AfterContentInit, AfterViewInit, Component, ContentChild, OnInit, viewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';

import { TermGridComponent } from './term-grid.component';
import { DataDomainGridComponent } from './data-domain-grid.component';
import { WordGridComponent } from './word-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { DataDomainFormComponent } from './data-domain-form.component';
import { TermFormComponent } from './term-form.component';
import { WordFormComponent } from './word-form.component';

@Component({
  selector: 'app-term',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzDrawerModule,
    NzTabsModule,
    NzGridModule,
    NzDividerModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,

    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    DataDomainFormComponent,
    DataDomainGridComponent,
    TermFormComponent,
    TermGridComponent,
    WordFormComponent,
    WordGridComponent
  ],
  template: `
<div class="page-header">
  <app-nz-page-header-custom title="용어사전 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>
</div>

<app-nz-search-area [height]="'var(--page-search-height)'">
  <div nz-row>
    <div nz-col [nzSpan]="12">
      <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
        <input type="text" [(ngModel)]="query.term.value" nz-input placeholder="input search text" (keyup.enter)="getTermList()">
      </nz-input-group>
      <ng-template #addOnBeforeTemplate>
        <nz-select [(ngModel)]="query.term.key">
          @for (option of query.term.list; track option.value) {
          <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
          }
        </nz-select>
      </ng-template>
      <ng-template #suffixIconSearch>
        <span nz-icon nzType="search"></span>
      </ng-template>
    </div>
    <div nz-col [nzSpan]="12" style="text-align: right;">
      <button nz-button (click)="getTermList()">
        <span nz-icon nzType="search"></span>조회
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="newTerm()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규 용어
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="newWord()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규 단어
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="newDomain()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규 도메인
      </button>
    </div>
  </div>
</app-nz-search-area>


<div class="page-content">
  <nz-tabset [nzSelectedIndex]="tabIndex">
    <nz-tab nzTitle="용어사전">
      <!--<h3>용어사전 목록</h3>-->
      <div class="grid-wrapper">
        <app-term-grid #termGrid
          (rowClicked)="termGridSelected($event)"
          (editButtonClicked)="editTerm($event)"
          (rowDoubleClicked)="editTerm($event)">
        </app-term-grid>
      </div>
    </nz-tab>

    <nz-tab nzTitle="단어사전">
      <div class="grid-wrapper">
        <app-word-grid #wordGrid
        (rowClicked)="wordGridSelected($event)"
        (editButtonClicked)="editWord($event)"
        (rowDoubleClicked)="editWord($event)">
        </app-word-grid>
      </div>
    </nz-tab>

    <nz-tab nzTitle="도메인">
      <div class="grid-wrapper">
        <app-data-domain-grid #domainGrid
          (rowClicked)="domainGridSelected($event)"
          (editButtonClicked)="this.drawer.domain.visible = true"
          (rowDoubleClicked)="this.drawer.domain.visible = true">
        </app-data-domain-grid>
      </div>
    </nz-tab>
  </nz-tabset>
</div>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.term.visible"
  nzTitle="용어 등록"
  (nzOnClose)="this.drawer.term.visible = false">
    <app-term-form *nzDrawerContent
      #termForm
      [initLoadId]="drawer.term.initLoadId"
      (formSaved)="getTermList()"
      (formDeleted)="getTermList()"
      (formClosed)="this.drawer.term.visible = false">
    </app-term-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.word.visible"
  nzTitle="단어 등록"
  (nzOnClose)="this.drawer.word.visible = false">
    <app-word-form *nzDrawerContent #wordForm
      [initLoadId]="drawer.word.initLoadId"
      (formSaved)="getWordList()"
      (formDeleted)="getWordList()"
      (formClosed)="drawer.word.visible = false">
    </app-word-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.domain.visible"
  nzTitle="도메인 등록"
  (nzOnClose)="drawer.domain.visible = false">
    <app-data-domain-form *nzDrawerContent #doaminForm
      [initLoadId]="drawer.domain.initLoadId"
      (formSaved)="getDomainList()"
      (formDeleted)="getDomainList()"
      (formClosed)="drawer.domain.visible = false">
    </app-data-domain-form>
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
                        var(--page-content-title-height) +
                        var(--page-content-title-margin-height) +
                        var(--page-content-margin-height)
                       )
              );
}

.grid-wrapper {
  height: calc(100vh - 304px);
  margin: 0;
  padding: 0;
}
  `
})
export class TermComponent extends AppBase implements OnInit {

  termGrid = viewChild.required(TermGridComponent);
  wordGrid = viewChild.required(WordGridComponent);
  domainGrid = viewChild.required(DataDomainGridComponent);

  query: {
    term : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    term : {
      key: 'term',
      value: '',
      list: [
        {label: '용어', value: 'term'},
        {label: '업무영역', value: 'domain'}
      ]
    }
  }

  drawer: {
    term: { visible: boolean, initLoadId: any },
    word: { visible: boolean, initLoadId: any },
    domain: { visible: boolean, initLoadId: any }
  } = {
    term: { visible: false, initLoadId: null },
    word: { visible: false, initLoadId: null },
    domain: { visible: false, initLoadId: null },
  }

  tabIndex: number = 0;

  ngOnInit(): void {
  }

  getList() {
    if (this.tabIndex === 0) {
      this.getTermList();
    } else if (this.tabIndex === 1) {
      this.getWordList();
    } else if (this.tabIndex === 2) {
      this.getDomainList();
    }
  }

  //#region 용어사전
  getTermList() {
    let params: any = new Object();
    if ( this.query.term.value !== '') {
      params[this.query.term.key] = this.query.term.value;
    }

    this.drawer.term.visible = false;
    this.termGrid().getList(params);
  }

  newTerm() {
    this.drawer.term.initLoadId = null;
    this.drawer.term.visible = true;
  }

  editTerm(item: any) {
    this.drawer.term.initLoadId = item.termId;
    this.drawer.term.visible = true;
  }

  termGridSelected(item: any) {
    this.drawer.term.initLoadId = item.termId;
  }
  //#endregion 용어사전

  //#region 단어사전
  getWordList() {
    this.drawer.word.visible = false;
    this.wordGrid().getList();
  }

  newWord() {
    this.drawer.word.initLoadId = null;
    this.drawer.word.visible = true;
  }

  editWord(item: any) {
    this.drawer.word.initLoadId = item.logicalName;
    this.drawer.word.visible = true;
  }

  wordGridSelected(item: any) {
    this.drawer.word.initLoadId = item.logicalName;
  }
  //#endregion 단어사전

  //#region 도메인
  getDomainList() {
    this.drawer.domain.visible = false;
    this.domainGrid().getList();
  }

  newDomain() {
    this.drawer.domain.initLoadId = null;
    this.drawer.domain.visible = true;
  }

  domainGridSelected(item: any) {
    this.drawer.domain.initLoadId = item.domainId;
  }
  //#endregion 도메인

}
