import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppLayoutModule } from '../app-layout/app-layout.module';
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


const layoutroutes: Routes = [
  {
    path: '', component: AppLayoutComponent, //canActivateChild: [AuthGuardService],
    children: [
      /* 공통 시스템 */
      {path: 'user',          component: UserComponent},
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

@NgModule({
  imports: [RouterModule.forChild(layoutroutes), AppLayoutModule],
  exports: [RouterModule]
})
export class SystemManagementRoutingModule { }
