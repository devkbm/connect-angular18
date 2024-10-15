
import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'team',          loadComponent: () => import('./team/team.component').then(mod => mod.TeamComponent)},
      {path: 'board',         loadComponent: () => import('./board/board.component').then(mod => mod.BoardComponent)},
      {path: 'boardm',        loadComponent: () => import('./board/board-management/board-management.component').then(mod => mod.BoardManagementComponent)},
      {path: 'todo',          loadComponent: () => import('./todo/todos.component').then(mod => mod.TodosComponent)},
      {path: 'workcalendar',  loadComponent: () => import('./work-calendar/work-calendar.component').then(mod => mod.WorkCalendarComponent)}
    ]
  }
];
