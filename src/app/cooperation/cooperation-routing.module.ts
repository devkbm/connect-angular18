import { BoardManagementComponent } from './board/board-management/board-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppLayoutModule } from '../app-layout/app-layout.module';
import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';
import { TeamComponent } from './team/team.component';
import { BoardComponent } from './board/board.component';
import { TodosComponent } from './todo/todos.component';
import { WorkCalendarComponent } from './work-calendar/work-calendar.component';
import { ArticleFormComponent } from './board/article/article-form.component';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes), AppLayoutModule],
  exports: [RouterModule]
})
export class CooperationRoutingModule { }
