import { CommonModule, Location } from '@angular/common';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { Component, OnInit, viewChild } from '@angular/core';

import { AppBase } from 'src/app/core/app/app-base';
import { StaffRegistFormComponent } from './staff-regist-form.component';
import { StaffGridComponent } from './staff-grid.component';
import { StaffAppointmentRecordGridComponent } from './staff-appointment-record/staff-appointment-record-grid.component';
import { StaffFamilyGridComponent } from './staff-family/staff-family-grid.component';
import { StaffFamily } from './staff-family/staff-family.model';
import { StaffLicense } from './staff-license/staff-license.model';
import { StaffLicenseGridComponent } from './staff-license/staff-license-grid.component';
import { StaffAppointmentRecord } from './staff-appointment-record/staff-appointment-record.model';
import { StaffSchoolCareer } from './staff-school-career/staff-school-career.model';
import { StaffSchoolCareerGridComponent } from './staff-school-career/staff-school-career-grid.component';
import { StaffCurrentAppointmentDescriptionComponent } from './staff-current-appointment-description.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NewStaffFormComponent } from './new-staff-form/new-staff-form.component';
import { StaffAppointmentRecordFormComponent } from './staff-appointment-record/staff-appointment-record-form.component';
import { StaffCardListComponent } from './staff-card/staff-card-list.component';
import { StaffCardComponent } from './staff-card/staff-card.component';
import { StaffContactFormComponent } from './staff-contact/staff-contact-form.component';
import { StaffDutyResponsibilityFormComponent } from './staff-duty-responsibility/staff-duty-responsibility-form.component';
import { StaffDutyResponsibilityListComponent } from './staff-duty-responsibility/staff-duty-responsibility-list.component';
import { StaffFamilyFormComponent } from './staff-family/staff-family-form.component';
import { StaffLicenseFormComponent } from './staff-license/staff-license-form.component';
import { StaffSchoolCareerFormComponent } from './staff-school-career/staff-school-career-form.component';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzDrawerModule,
    NzTabsModule,
    NzCollapseModule,
    NzDividerModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,

    NzPageHeaderCustomComponent,

    StaffAppointmentRecordGridComponent,
    StaffFamilyGridComponent,
    StaffLicenseGridComponent,
    StaffSchoolCareerGridComponent,
    NewStaffFormComponent,
    StaffAppointmentRecordFormComponent,
    StaffContactFormComponent,
    StaffDutyResponsibilityFormComponent,
    StaffFamilyFormComponent,
    StaffLicenseFormComponent,
    StaffSchoolCareerFormComponent,
    StaffRegistFormComponent,
    StaffGridComponent,
    StaffCurrentAppointmentDescriptionComponent,
    StaffCardComponent,
    StaffCardListComponent,
    StaffDutyResponsibilityListComponent
  ],
  template: `
<app-nz-page-header-custom title="직원정보관리" subtitle="This is a subtitle"></app-nz-page-header-custom>

<div nz-row class="btn-group">

  <div nz-col [nzSpan]="24" style="text-align: right;">
    {{selectedStaff | json}}
    <button nz-button (click)="selectGridStaff()">
      <span nz-icon nzType="search" nzTheme="outline"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzType="primary" (click)="newStaff()">
      <span nz-icon nzType="save" nzTheme="outline"></span>신규직원등록
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzType="primary" (click)="newDutyResponsibility()">
      <span nz-icon nzType="save" nzTheme="outline"></span>직책등록
    </button>
  </div>
</div>

<div class="app-grid">
  <app-staff-grid
    (rowClicked)="staffGridRowClicked($event)">
  </app-staff-grid>

  <div>
    <app-staff-regist-form [staffNo]="selectedStaff?.staffNo">
    </app-staff-regist-form>
    <nz-collapse>
      <nz-collapse-panel [nzHeader]="'발령'">
        <app-staff-current-appointment-description [staffNo]="selectedStaff?.staffNo">
        </app-staff-current-appointment-description>
      </nz-collapse-panel>
      <nz-collapse-panel [nzHeader]="'보직'">
        <div style="height:100px; padding: 0px; margin: 0px;">
          <app-staff-duty-responsibility-list
            [staffId]="selectedStaff?.staffNo">
          </app-staff-duty-responsibility-list>
        </div>
      </nz-collapse-panel>
    </nz-collapse>
  </div>


  <div>
    <nz-tabset [nzAnimated]="false">
      <nz-tab nzTitle="연락처">
        <div class="tab-grid">
          <app-staff-contact-form
            [staff]="selectedStaff"
            (formSaved)="selectGridAppointment()"
            (formDeleted)="selectGridAppointment()"
            (formClosed)="drawer.contact.visible = false">
          </app-staff-contact-form>
        </div>
      </nz-tab>

      <nz-tab nzTitle="발령기록">
        <button nz-button nzType="primary" (click)="newAppoint()">
          <span nz-icon nzType="save" nzTheme="outline"></span>발령등록
        </button>
        @defer (on idle) {
        <div class="tab-grid">
          <app-staff-appointment-record-grid
            [staffNo]="selectedStaff?.staffNo"
            (editButtonClicked)="editAppointment($event)"
            (rowDoubleClicked)="editAppointment($event)">
          </app-staff-appointment-record-grid>
        </div>
        }
      </nz-tab>

      <nz-tab nzTitle="가족">
        <button nz-button nzType="primary" (click)="newFamily()">
          <span nz-icon nzType="save" nzTheme="outline"></span>가족등록
        </button>
        @defer {
        <div class="tab-grid">
          <app-staff-family-grid
            [staffId]="selectedStaff?.staffNo"
            (editButtonClicked)="editFamily($event)"
            (rowDoubleClicked)="editFamily($event)">
          </app-staff-family-grid>
        </div>
        }
      </nz-tab>

      <nz-tab nzTitle="학력">
        <button nz-button nzType="primary" (click)="newSchoolCareer()">
          <span nz-icon nzType="save" nzTheme="outline"></span>학력등록
        </button>
        @defer (on idle) {
        <div class="tab-grid">
          <app-staff-school-career-grid
            [staffId]="selectedStaff?.staffNo"
            (editButtonClicked)="editSchoolCareer($event)"
            (rowDoubleClicked)="editSchoolCareer($event)">
          </app-staff-school-career-grid>
        </div>
        }
      </nz-tab>

      <nz-tab nzTitle="자격면허">
        <button nz-button nzType="primary" (click)="newLicense()">
          <span nz-icon nzType="save" nzTheme="outline"></span>자격면허등록
        </button>
        @defer (on idle) {
        <div class="tab-grid">
          <app-staff-license-grid
            [staffId]="selectedStaff?.staffNo"
            (editButtonClicked)="editLicense($event)"
            (rowDoubleClicked)="editLicense($event)">
          </app-staff-license-grid>
        </div>
        }
      </nz-tab>

      <nz-tab nzTitle="카드명단">
      @defer (on idle) {
        <div class="tab-grid">
          <app-staff-card-list>
          </app-staff-card-list>
        </div>
      }
      </nz-tab>

    </nz-tabset>
  </div>

</div>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.newStaff.visible"
  nzTitle="직원 등록"
  (nzOnClose)="drawer.newStaff.visible = false">
    <!-- (formSaved)="getForm(newStaff.selectedRowId)" -->
    <app-new-staff-form *nzDrawerContent
      [initLoadId]="drawer.newStaff.initLoadId"
      (formSaved)="selectGridStaff()"
      (formDeleted)="selectGridStaff()"
      (formClosed)="drawer.newStaff.visible = false">
    </app-new-staff-form>
</nz-drawer>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.appointment.visible"
  nzTitle="발령 등록"
  (nzOnClose)="drawer.appointment.visible = false">
    <app-staff-appointment-record-form *nzDrawerContent
      [staff]="selectedStaff"
      [initLoadId]="drawer.appointment.initLoadId"
      (formSaved)="selectGridAppointment()"
      (formDeleted)="selectGridAppointment()"
      (formClosed)="drawer.appointment.visible = false">
    </app-staff-appointment-record-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.dutyResponsibility.visible"
  nzTitle="직책 등록"
  (nzOnClose)="drawer.dutyResponsibility.visible = false">
  <!--(formSaved)="selectGridAppointment()"
      (formDeleted)="selectGridAppointment()"-->
    <app-staff-duty-responsibility-form *nzDrawerContent
      [staff]="selectedStaff"
      [initLoadId]="drawer.dutyResponsibility.initLoadId"
      (formClosed)="drawer.dutyResponsibility.visible = false">
    </app-staff-duty-responsibility-form>
</nz-drawer>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.contact.visible"
  nzTitle="연락처 등록"
  (nzOnClose)="drawer.contact.visible = false">
    <app-staff-contact-form *nzDrawerContent
      [initLoadId]="drawer.contact.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridAppointment()"
      (formDeleted)="selectGridAppointment()"
      (formClosed)="drawer.contact.visible = false">
    </app-staff-contact-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.family.visible"
  nzTitle="가족 등록"
  (nzOnClose)="drawer.family.visible = false">
    <app-staff-family-form *nzDrawerContent
      [initLoadId]="drawer.family.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridFaimly()"
      (formDeleted)="selectGridFaimly()"
      (formClosed)="drawer.family.visible = false">
    </app-staff-family-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.schoolCareer.visible"
  nzTitle="학력 등록"
  (nzOnClose)="drawer.schoolCareer.visible = false">
    <app-staff-school-career-form *nzDrawerContent
      [initLoadId]="drawer.schoolCareer.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridSchoolCareer()"
      (formDeleted)="selectGridSchoolCareer()"
      (formClosed)="drawer.schoolCareer.visible = false">
    </app-staff-school-career-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.license.visible"
  nzTitle="자격면허 등록"
  (nzOnClose)="drawer.license.visible = false">
    <app-staff-license-form *nzDrawerContent
      [initLoadId]="drawer.license.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridLicense()"
      (formDeleted)="selectGridLicense()"
      (formClosed)="drawer.license.visible = false">
    </app-staff-license-form>
</nz-drawer>

  `,
  styles: `
.app-grid {
  height: calc(100vh - 336px);
  display: grid;
  /*grid-auto-flow: column;*/
  grid-template-rows: 1fr;
  grid-template-columns: 200px 400px 1fr;
  column-gap: 10px;
  margin-top: 10px;

}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.tab-grid {
  height: calc(100vh - 336px);
}
  `
})
export class StaffManagementComponent extends AppBase implements OnInit {

  gridStaff = viewChild.required(StaffGridComponent);
  formStaff = viewChild.required(StaffRegistFormComponent);
  staffDesc = viewChild.required(StaffCurrentAppointmentDescriptionComponent);
  gridAppointment = viewChild.required(StaffAppointmentRecordGridComponent);
  gridFamily = viewChild.required(StaffFamilyGridComponent);
  gridLicense = viewChild.required(StaffLicenseGridComponent);
  gridSchoolcareer = viewChild.required(StaffSchoolCareerGridComponent);

  selectedStaff?: {companyCode: string, staffNo: string, staffName: string};

  drawer: {
    newStaff: { visible: boolean, initLoadId: any },
    appointment: { visible: boolean, initLoadId: any },
    dutyResponsibility: { visible: boolean, initLoadId: any },
    contact: { visible: boolean, initLoadId: any },
    family: { visible: boolean, initLoadId: any },
    schoolCareer: { visible: boolean, initLoadId: any },
    license: { visible: boolean, initLoadId: any }
  } = {
    newStaff: { visible: false, initLoadId: null },
    appointment: { visible: false, initLoadId: null },
    dutyResponsibility: { visible: false, initLoadId: null },
    contact: { visible: false, initLoadId: null },
    family: { visible: false, initLoadId: null },
    schoolCareer: { visible: false, initLoadId: null },
    license: { visible: false, initLoadId: null }
  }

  constructor() {
    super();
  }

  ngOnInit() {
  }

  staffGridRowClicked(params: any) {
    console.log(params);
    this.selectedStaff = {companyCode: params.companyCode, staffNo: params.staffNo, staffName: params.name};
    this.formStaff().get(params.staffNo);
  }

  selectGridStaff() {
    this.drawer.newStaff.visible = false;

    this.gridStaff().getList();
  }

  newStaff() {
    this.drawer.newStaff.visible = true;
  }

  newAppoint() {
    this.drawer.appointment.visible = true;
  }

  newDutyResponsibility() {
    this.drawer.dutyResponsibility.visible = true;
  }

  newContact() {
    this.drawer.contact.visible = true;
  }

  selectGridAppointment() {
    this.drawer.appointment.visible = false;
    this.gridAppointment().getList(this.selectedStaff?.staffNo!);
    this.staffDesc().get(this.selectedStaff?.staffNo!);
  }

  editAppointment(row: StaffAppointmentRecord) {
    this.drawer.appointment.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.appointment.visible = true;
  }

  selectGridFaimly() {
    this.drawer.family.visible = false;
    this.gridFamily().getList(this.selectedStaff?.staffNo!);
  }

  newFamily() {
    this.drawer.family.visible = true;
  }

  editFamily(row: StaffFamily) {
    this.drawer.family.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.family.visible = true;
  }

  selectGridSchoolCareer() {
    this.drawer.schoolCareer.visible = false;
    this.gridSchoolcareer().getList(this.selectedStaff?.staffNo!);
  }

  newSchoolCareer() {
    this.drawer.schoolCareer.visible = true;
  }

  editSchoolCareer(row: StaffSchoolCareer) {
    this.drawer.schoolCareer.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.schoolCareer.visible = true;
  }

  selectGridLicense() {
    this.drawer.license.visible = false;
    this.gridLicense().getList(this.selectedStaff?.staffNo!);
  }

  newLicense() {
    this.drawer.license.visible = true;
  }

  editLicense(row: StaffLicense) {
    this.drawer.license.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.license.visible = true;
  }

}
