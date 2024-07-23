import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* AG-GRID */
import { AgGridModule } from 'ag-grid-angular';

import { ButtonRendererComponent } from './grid/renderer/button-renderer.component';
import { CheckboxRendererComponent } from './grid/renderer/checkbox-renderer.component';

import { UserSessionService } from './service/user-session.service';
import { AuthGuardService } from './service/auth-guard.service';
import { AppAlarmService } from './service/app-alarm.service';

/* NG-ZORRO */
import { NZ_I18N, ko_KR } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AccountBookFill, AlertFill, AlertOutline, MenuFoldOutline, MenuUnfoldOutline } from '@ant-design/icons-angular/icons';
const icons: IconDefinition[] = [ AccountBookFill, AlertOutline, AlertFill, MenuFoldOutline, MenuUnfoldOutline ];

const nzModules = [
  NzIconModule,
  NzButtonModule,
  NzCheckboxModule
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    nzModules,

    CheckboxRendererComponent,
    ButtonRendererComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: ko_KR },
    UserSessionService,
    AuthGuardService,
    AppAlarmService
  ],
  exports: [
    ButtonRendererComponent,
    CheckboxRendererComponent
  ]
})
export class CoreModule { }
