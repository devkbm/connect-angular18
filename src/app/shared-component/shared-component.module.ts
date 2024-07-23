import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* NG MODULES */
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

/* Angular Material */
import { MatListModule } from '@angular/material/list';

import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { ColorPickerModule } from 'ngx-color-picker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DeptHierarchyService } from './nz-dept-tree-select/dept-hierarchy.service';
import { RouterModule } from '@angular/router';


import { NgxMaskDirective, NgxMaskPipe, provideNgxMask, IConfig } from 'ngx-mask'
export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null

import { NzListRoadAddressComponent } from './nz-list-road-address/nz-list-road-address.component';
import { RoadAddressService } from './nz-list-road-address/road-address.service';

const nzModules = [
  NzPageHeaderModule,
  NzFormModule,
  NzInputModule,
  NzInputNumberModule,
  NzSelectModule,
  NzButtonModule,
  NzDividerModule,
  NzPopconfirmModule,
  NzIconModule,
  NzTreeSelectModule,
  NzDatePickerModule,
  NzTimePickerModule,
  NzUploadModule,
  NzSwitchModule,
  NzCheckboxModule,
  NzDropDownModule,
  NzBreadCrumbModule,
  NzMessageModule,
  NzListModule,
  NzTypographyModule,
  NzPaginationModule,
  NzRadioModule
]

const matModules = [
  MatListModule
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    nzModules,
    matModules,
    ColorPickerModule,
    CKEditorModule,
    NgxMaskDirective, NgxMaskPipe
  ],
  declarations: [
   ],
  providers: [
    DeptHierarchyService,
    RoadAddressService,
    provideNgxMask()
  ],
  exports: [
  ]
})
export class SharedComponentModule { }
