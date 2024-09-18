
import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

import { BoardManagementComponent } from './board/board-management/board-management.component';
import { TeamComponent } from './team/team.component';
import { BoardComponent } from './board/board.component';
import { TodosComponent } from './todo/todos.component';
import { WorkCalendarComponent } from './work-calendar/work-calendar.component';


export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      /* 협업시스템 */
      {path: 'team',          component: TeamComponent},
      {path: 'board',         component: BoardComponent},
      {path: 'boardm',        component: BoardManagementComponent},
      {path: 'todo',          component: TodosComponent},
      {path: 'workcalendar',  component: WorkCalendarComponent},
    ]
  }
];
