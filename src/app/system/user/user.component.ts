import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';
import { ResponseObject } from 'src/app/core/model/response-object';

import { UserGridComponent } from './user-grid.component';
import { UserService } from './user.service';
import { User } from './user.model';

import { ButtonTemplate } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { UserFormComponent } from './user-form.component';
import { UserImageUploadComponent } from './user-image-upload.component';
import { UserPopupComponent } from './user-popup.component';
import { UserProfileComponent } from '../../app-layout/user-profile/user-profile.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzDrawerModule,
    NzDividerModule,
    NzButtonModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    UserPopupComponent,
    UserGridComponent,
    UserImageUploadComponent,
    UserFormComponent,
    UserProfileComponent
  ],
  template: `
<div class="page-header">
  <app-nz-page-header-custom title="사용자 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>
</div>

<app-nz-search-area [height]="'var(--page-search-height)'">
  <div nz-row>
    <div nz-col [nzSpan]="12">
      <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
        <ng-template #addOnBeforeTemplate>
          <nz-select [(ngModel)]="query.user.key">
            @for (option of query.user.list; track option.value) {
            <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>
        </ng-template>
        <input type="text" [(ngModel)]="query.user.value" nz-input placeholder="input search text" (keyup.enter)="getUserList()">
        <ng-template #suffixIconSearch>
          <span nz-icon nzType="search"></span>
        </ng-template>
      </nz-input-group>
    </div>

    <div nz-col [nzSpan]="12" style="text-align: right;">
      <!--<app-nz-buttons [buttons]="buttons"></app-nz-buttons>-->

      <button nz-button (click)="test()">
        <span nz-icon nzType="search"></span>구글 로그인
      </button>
      <button nz-button (click)="getUserList()">
        <span nz-icon nzType="search"></span>조회
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="newForm()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button nzDanger="true"
        nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
        (nzOnConfirm)="deleteUser()" (nzOnCancel)="false">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
      </button>
    </div>
  </div>
</app-nz-search-area>


<div class="page-content-title">
  <h3 class="grid-title">사용자 목록</h3>
</div>

<div class="page-content">
  <app-user-grid #userGrid
    (rowClicked)="userGridSelected($event)"
    (editButtonClicked)="editForm($event)"
    (rowDoubleClicked)="editForm($event)">
  </app-user-grid>
</div>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  [nzWidth]="720"
  [nzVisible]="drawer.user.visible"
  nzTitle="사용자 등록"
  (nzOnClose)="drawer.user.visible = false">
    <app-user-form *nzDrawerContent
      [initLoadId]="drawer.user.initLoadId"
      (formSaved)="getUserList()"
      (formDeleted)="getUserList()"
      (formClosed)="drawer.user.visible = false">
    </app-user-form>
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
  --margin-height: 6px;
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

[nz-button] {
  margin: auto;
}

  `
})
export class UserComponent extends AppBase implements OnInit {

  grid = viewChild.required(UserGridComponent);

  buttons: ButtonTemplate[] = [{
    text: '구글 로그인',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.test();
    }
  },{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getUserList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.newForm();
    }
  },{
    text: '삭제',
    nzType: 'delete',
    isDanger: true,
    popConfirm: {
      title: '삭제하시겠습니까?',
      confirmClick: () => {
        this.deleteUser();
      }
    }
  }];

  query: {
    user : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    user : {
      key: 'userId',
      value: '',
      list: [
        {label: '아이디', value: 'userId'},
        {label: '성명', value: 'name'}
      ]
    }
  }

  drawer: {
    user: { visible: boolean, initLoadId: any }
  } = {
    user: { visible: false, initLoadId: null }
  }

  private service = inject(UserService);

  ngOnInit() {
  }

  newForm() {
    this.drawer.user.initLoadId = null;
    this.drawer.user.visible = true;

  }

  editForm(item: User) {
    console.log(item.userId);
    this.drawer.user.initLoadId = item.userId;
    this.drawer.user.visible = true;
  }

  getUserList() {
    let params: any = new Object();
    if ( this.query.user.value !== '') {
      params[this.query.user.key] = this.query.user.value;
    }

    this.drawer.user.visible = false;

    console.log(this.grid);
    this.grid().getUserList(params);
  }

  deleteUser() {
    const userId: string = this.grid().getSelectedRow().userId;
    this.service
        .deleteUser(userId)
        .subscribe(
          (model: ResponseObject<User>) => {
            this.getUserList();
          }
        );
  }

  userGridSelected(params: any) {
    this.drawer.user.initLoadId = params.userId;
  }

  test() {
    window.location.href = 'http://localhost:8090/oauth2/authorization/google';
  }
}

