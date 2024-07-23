import { Component, TemplateRef, inject, input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MenuBreadCrumb, SessionManager } from 'src/app/core/session-manager';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';

// NzBreadCrumbModule
@Component({
  selector: 'app-nz-page-header-custom',
  standalone: true,
  imports: [CommonModule, NzPageHeaderModule, NzBreadCrumbModule, NzIconModule],
  template: `
   <nz-page-header (nzBack)="goBack()" nzBackIcon [nzTitle]="title()" [nzSubtitle]="subtitle()">
    <nz-breadcrumb nz-page-header-breadcrumb nzSeparator=">" >
      <nz-breadcrumb-item><a routerLink="/home"><span nz-icon [nzType]="'home'"></span></a></nz-breadcrumb-item>
      @for (menu of menuBreadCrumb; track menu.url) {
        <nz-breadcrumb-item>{{menu.name}}</nz-breadcrumb-item>
      }
    </nz-breadcrumb>
  </nz-page-header>
  `,
  styles: []
})
export class NzPageHeaderCustomComponent {

  menuBreadCrumb: MenuBreadCrumb[] = SessionManager.createBreadCrumb();

  title = input<string | TemplateRef<void>>('');
  subtitle = input<string | TemplateRef<void>>('');

  protected _location = inject(Location);

  goBack() {
    this._location.back();
  }

  goFoward() {
    this._location.forward();
  }

}
