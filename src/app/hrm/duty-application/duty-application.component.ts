import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppBase } from 'src/app/core/app/app-base';

import { DutyApplicationFormComponent } from './duty-application-form.component';
import { DutyApplicationGridComponent } from './duty-application-grid.component';
import { DutyDateListComponent } from './duty-date-list.component';


import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-duty-application',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzCrudButtonGroupComponent,

    NzPageHeaderCustomComponent,

    DutyDateListComponent,
    DutyApplicationGridComponent,
    DutyApplicationFormComponent
  ],
  template: `
<app-nz-page-header-custom title="부서코드 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<div nz-row class="btn-group">

</div>

<div class="grid-wrapper">

  <app-duty-application-grid>
  </app-duty-application-grid>

  <app-duty-application-form>
  </app-duty-application-form>
</div>

  `,
  styles: `
.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.grid-wrapper {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 300px 1fr;
}

  `
})
export class DutyApplicationComponent extends AppBase implements OnInit, AfterViewInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }


}
