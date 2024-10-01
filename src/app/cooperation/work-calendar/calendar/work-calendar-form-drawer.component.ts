import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { WorkCalendarFormComponent } from './work-calendar-form.component';

@Component({
  selector: 'app-work-calendar-form-drawer',
  standalone: true,
  imports: [
    NzDrawerModule,
    NzCrudButtonGroupComponent,
    WorkCalendarFormComponent
  ],
  template: `
    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer().visible"
      nzTitle="CALENDAR 등록"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">

      <app-work-calendar-form *nzDrawerContent
        [initLoadId]="drawer().initLoadId"
        (formSaved)="closeDrawer($event)"
        (formDeleted)="closeDrawer($event)"
        (formClosed)="drawer().visible = false">
      </app-work-calendar-form>
    </nz-drawer>

    <ng-template #footerTpl>
      <div style="float: right">
        <app-nz-crud-button-group
          [searchVisible]="false"
          [isSavePopupConfirm]="false"
          (closeClick)="closeDrawer()"
          (saveClick)="save()"
          (deleteClick)="remove()">
        </app-nz-crud-button-group>
      </div>
    </ng-template>
  `,
  styles: []
})
export class WorkCalendarFormDrawerComponent {

  drawer = input.required<{visible: boolean, initLoadId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<WorkCalendarFormComponent>(WorkCalendarFormComponent);

  save() {
    this.form().save();
  }

  remove() {
    this.form().remove();
  }

  closeDrawer(params?: any) {
    this.form().closeForm();

    this.drawerClosed.emit(params);
  }

}