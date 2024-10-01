import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

import { RoleComponent } from './role/role.component';
import { UserComponent } from '../system/user/user.component';
import { WebResourceComponent } from '../system/webresource/web-resource.component';
import { MenuComponent } from '../system/menu/menu.component';
import { TermComponent } from '../system/terms/term.component';
import { CommonCodeComponent } from '../system/commoncode/common-code.component';
import { DeptComponent } from '../system/dept/dept.component';
import { HolidayComponent } from '../system/holiday/holiday.component';
import { BizCodeComponent } from '../system/biz-code/biz-code.component';
import { MenuRoleComponent } from './menu-role/menu-role.component';
import { CompanyComponent } from './company/company.component';


export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent, //canActivateChild: [AuthGuardService],
    children: [
      /* 공통 시스템 */
      {path: 'company',       component: CompanyComponent},
      {path: 'user',          component: UserComponent, data: {breadcrumb: 'user'}},
      {path: 'role',          component: RoleComponent},
      {path: 'menu',          component: MenuComponent},
      {path: 'menu-role',     component: MenuRoleComponent},
      {path: 'webresource',   component: WebResourceComponent},
      {path: 'commoncode',    component: CommonCodeComponent},
      {path: 'dept',          component: DeptComponent},
      {path: 'term',          component: TermComponent},
      {path: 'holiday',       component: HolidayComponent},
      {path: 'bizcode',       component: BizCodeComponent}

    ]
  }
];
