import { Routes } from '@angular/router';
import { AppLayoutComponent } from 'src/app/app-layout/app-layout.component';
import { AuthGuardChildFunction } from 'src/app/core/service/auth-guard.service';
import { LoginComponent } from 'src/app/login/login.component';
import { Login2Component } from 'src/app/login/login2.component';
import { Login3Component } from 'src/app/login/login3.component';
import { ArticleFormComponent } from './cooperation/board/article/article-form.component';
import { ArticleViewComponent } from './cooperation/board/article/article-view.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login/:id', component: LoginComponent },
  {path: 'login', component: LoginComponent },
  {path: 'login2', component: Login2Component },
  {path: 'login3', component: Login3Component },
  //{path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardService]},
  {path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardChildFunction]},
  {path: 'test', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)},
  {path: 'system', loadChildren: () => import('src/app/system/system-management.module').then(m => m.SystemManagementModule)},
  {path: 'hrm', loadChildren: () => import('src/app/hrm/hrm.module').then(m => m.HrmModule)},
  {path: 'grw', loadChildren: () => import('src/app/cooperation/cooperation.module').then(m => m.CooperationModule)},
  {path: 'article-write/:boardId', component: ArticleFormComponent},
  {path: 'article-edit/:boardId/:initLoadId', component: ArticleFormComponent},
  {path: 'article-view', component: ArticleViewComponent}

];
