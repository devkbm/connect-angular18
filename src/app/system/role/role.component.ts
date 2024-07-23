import { CommonModule } from '@angular/common';

import { AfterViewInit, Component, inject, viewChild } from '@angular/core';

import { AppBase } from 'src/app/core/app/app-base';
import { ResponseObject } from 'src/app/core/model/response-object';

import { RoleGridComponent } from './role-grid.component';
import { RoleService } from './role.service';
import { Role } from './role.model';

import { ButtonTemplate, NzButtonsComponent } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { RoleFormComponent } from './role-form.component';

@Component({
  selector: 'app-authority',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    /* NG-ZORRO  */
    NzButtonModule,
    NzPopconfirmModule,
    NzGridModule,
    NzSelectModule,
    NzInputModule,
    NzDrawerModule,
    NzDividerModule,
    /* Shared Component */
    NzButtonsComponent,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    RoleGridComponent,
    RoleFormComponent
  ],
  template: `
<div class="page-header">
  <app-nz-page-header-custom class="page-header" title="롤 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>
</div>

<app-nz-search-area [height]="'var(--page-search-height)'">
  <div nz-row>
    <div nz-col [nzSpan]="12">
      <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
        <ng-template #addOnBeforeTemplate>
          <nz-select [(ngModel)]="query.role.key">
            @for (option of query.role.list; track option.value) {
            <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>
        </ng-template>
        <input type="text" [(ngModel)]="query.role.value" nz-input placeholder="input search text" (keyup.enter)="getRoleList()">
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

<div class="page-content-title">
  <h3 class="grid-title">롤 목록</h3>
</div>

<div class="page-content">
  <app-role-grid #authGrid
    (rowClicked)="selectedItem($event)"
    (editButtonClicked)="editDrawOpen($event)"
    (rowDoubleClicked)="editDrawOpen($event)">
  </app-role-grid>
</div>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px'}"
  [nzMaskClosable]="true"
  [nzWidth]="720"
  [nzVisible]="drawer.role.visible"
  nzTitle="롤 등록"
  (nzOnClose)="closeDrawer()">
    <app-role-form #form *nzDrawerContent
      [initLoadId]="drawer.role.initLoadId"
      (formSaved)="getRoleList()"
      (formDeleted)="getRoleList()"
      (formClosed)="closeDrawer()">
    </app-role-form>
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

[nz-button] {
  margin: auto;
}
  `
})
export class RoleComponent extends AppBase implements AfterViewInit {

  private service = inject(RoleService);

  grid = viewChild.required(RoleGridComponent);

  query: {
    role : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    role : {
      key: 'roleCode',
      value: '',
      list: [
        {label: '롤', value: 'roleCode'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  drawer: {
    role: { visible: boolean, initLoadId: any }
  } = {
    role: { visible: false, initLoadId: null }
  }

  buttons: ButtonTemplate[] = [{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getRoleList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.initForm();
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

  ngAfterViewInit(): void {
  }

  openDrawer() {
    this.drawer.role.visible = true;
  }

  closeDrawer() {
    this.drawer.role.visible = false;
  }

  selectedItem(data: any) {
    if (data) {
      this.drawer.role.initLoadId = data.roleCode;
    } else {
      this.drawer.role.initLoadId = null;
    }
  }

  initForm() {
    this.drawer.role.initLoadId = null;

    this.openDrawer();
  }

  editDrawOpen(item: any) {
    this.openDrawer();
  }

  getRoleList() {
    let params: any = new Object();
    if ( this.query.role.value !== '') {
      params[this.query.role.key] = this.query.role.value;
    }

    this.closeDrawer();
    this.grid().getList(params);
  }

  delete() {
    const id = this.grid().getSelectedRows()[0].roleCode;

    this.service
        .deleteRole(id)
        .subscribe(
          (model: ResponseObject<Role>) => {
            this.getRoleList();
          }
        );
  }

}
