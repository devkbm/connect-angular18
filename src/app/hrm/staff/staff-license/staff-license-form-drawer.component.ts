import { Component, input, output, viewChild } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { StaffLicenseFormComponent } from './staff-license-form.component';

@Component({
  selector: 'app-staff-license-form-drawer',
  standalone: true,
  imports: [
    NzDrawerModule,
    NzCrudButtonGroupComponent,
    StaffLicenseFormComponent
  ],
  template: `
    <nz-drawer
      nzTitle="가족 등록"
      nzWidth="80%"
      [nzMaskClosable]="true"
      [nzVisible]="drawer().visible"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
        <app-staff-license-form *nzDrawerContent
          [initLoadId]="drawer().initLoadId"
          [staff]="selectedStaff()"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
        </app-staff-license-form>
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
export class StaffLicenseFormDrawerComponent {

  drawer = input.required<{visible: boolean, initLoadId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<StaffLicenseFormComponent>(StaffLicenseFormComponent);

  selectedStaff = input<any>();

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