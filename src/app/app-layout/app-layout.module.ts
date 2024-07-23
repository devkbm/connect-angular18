import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* NG-ZORRO */
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { AuthGuardService } from 'src/app/core/service/auth-guard.service';

import { AppLayoutService } from './app-layout.service';
import { AppLayoutComponent } from './app-layout.component';

import { UserPopupComponent } from 'src/app/system/user/user-popup.component';
import { UserProfileComponent } from 'src/app/app-layout/user-profile/user-profile.component';
import { SideMenuComponent } from './side-menu.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    /* NG-ZORRO */
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzIconModule,
    NzSelectModule,
    NzDropDownModule,
    UserProfileComponent,
    SideMenuComponent
  ],
  declarations: [
  ],
  providers: [
    AppLayoutService
  ],
  exports: [
  ]
})
export class AppLayoutModule { }
