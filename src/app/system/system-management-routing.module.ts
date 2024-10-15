import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent, //canActivateChild: [AuthGuardService],
    children: [
      {path: 'company',       loadComponent: () => import('./company/company.component').then(mod => mod.CompanyComponent)},
      {path: 'user',          loadComponent: () => import('./user/user.component').then(mod => mod.UserComponent), data: {breadcrumb: 'user'}},
      {path: 'role',          loadComponent: () => import('./role/role.component').then(mod => mod.RoleComponent)},
      {path: 'menu',          loadComponent: () => import('./menu/menu.component').then(mod => mod.MenuComponent)},
      {path: 'menu-role',     loadComponent: () => import('./menu-role/menu-role.component').then(mod => mod.MenuRoleComponent)},
      {path: 'webresource',   loadComponent: () => import('./webresource/web-resource.component').then(mod => mod.WebResourceComponent)},
      {path: 'commoncode',    loadComponent: () => import('./commoncode/common-code.component').then(mod => mod.CommonCodeComponent)},
      {path: 'dept',          loadComponent: () => import('./dept/dept.component').then(mod => mod.DeptComponent)},
      {path: 'term',          loadComponent: () => import('./terms/term.component').then(mod => mod.TermComponent)},
      {path: 'holiday',       loadComponent: () => import('./holiday/holiday.component').then(mod => mod.HolidayComponent)},
      {path: 'bizcode',       loadComponent: () => import('./biz-code/biz-code.component').then(mod => mod.BizCodeComponent)}
    ]
  }
];
