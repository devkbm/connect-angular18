import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';
import { AuthGuardChildFunction, AuthGuardService } from '../core/service/auth-guard.service';

import { DutyApplicationComponent } from './duty-application/duty-application.component';
import { HrmCodeComponent } from './hrm-code/hrm-code.component';
import { StaffManagementComponent } from './staff/staff-management.component';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      /* 인사시스템 */
      {path: 'hrmtype',           component: HrmCodeComponent},
      {path: 'dutyapplication',   component: DutyApplicationComponent},
      {path: 'staff',             component: StaffManagementComponent}
    ]
  }
];
