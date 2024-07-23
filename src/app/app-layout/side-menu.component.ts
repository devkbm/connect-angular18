import { Component, inject, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NzMenuModeType, NzMenuModule, NzMenuThemeType } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MenuHierarchy } from './app-layout.model';

import { AppLayoutService } from './app-layout.service';
import { SessionManager } from '../core/session-manager';
import { ResponseList } from '../core/model/response-list';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [ CommonModule, NzMenuModule, NzIconModule ],
  template: `
      <div class="logo">LOGO</div>

      <ul class="menu" nz-menu [nzTheme]="menuInfo.theme" [nzMode]="menuInfo.mode" [nzInlineIndent]="menuInfo.inline_indent">
        <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menuInfo.menuItems }"></ng-container>
        <ng-template #menuTpl let-menus>
          @for (menu of menus; track menu.key) {
            @if (!menu.children) {
              <li
                nz-menu-item
                [nzPaddingLeft]="menu.level * 24"
                [nzDisabled]="menu.disabled"
                [nzSelected]="menu.selected"
                (click)="moveToUrl(menu.url)"
              >
                @if (menu.icon) {
                  <span nz-icon [nzType]="menu.icon"></span>
                }
                <span>{{ menu.title }}</span>
              </li>
            } @else {
              <li
                nz-submenu
                [nzPaddingLeft]="menu.level * 24"
                [nzOpen]="menu.open"
                [nzTitle]="menu.title"
                [nzIcon]="menu.icon"
                [nzDisabled]="menu.disabled"
              >
              <ul>
                <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menu.children }"></ng-container>
              </ul>
            </li>
            }
          }
        </ng-template>
      </ul>
  `,
  styles: [`
    .logo {
      display: flex;
      /*위에서 아래로 수직 배치*/
      flex-direction: column;
      /*중앙정렬*/
      justify-content: center;
      text-align: center;
      width: 200px;
      height: 64px;

      background-color: darkslategray;
      color: white;
      font-weight: 300;
      font-size: 30px;
      line-height: 0.6;
      font-family: 'Bangers', cursive;
      letter-spacing: 5px;
      text-shadow: 5px 2px #222324, 2px 4px #222324, 3px 5px #222324;
    }

    .menu {
      height: 100%;
      width: 200px;
    }
  `]
})
export class SideMenuComponent {

  private router = inject(Router);
  private service = inject(AppLayoutService);

  menuInfo: {theme: NzMenuThemeType, mode: NzMenuModeType, inline_indent: number, isCollapsed: boolean, menuItems: MenuHierarchy[]} = {
    theme: 'dark',
    mode: 'inline',
    inline_indent: 12,
    isCollapsed: false,
    menuItems: []
  }

  menuGroupCode = input<string>('');
  menuUrl = input<string>('');

  constructor() {
    effect(() => {
      if (this.menuGroupCode() !== '') {
        this.getMenuList(this.menuGroupCode());
      }

      if (this.menuUrl() !== '') {
        this.moveToUrl(this.menuUrl());
      }
    })
  }

  moveToUrl(url: string) {
    sessionStorage.setItem('selectedMenu', url);
    this.router.navigate([url]);
  }

  getMenuList(menuGroupCode: string): void {

    this.service
        .getUserMenuHierarchy(SessionManager.getUserId() as string, menuGroupCode)
        .subscribe(
          (model: ResponseList<MenuHierarchy>) => {
            if ( model.total > 0 ) {
              this.menuInfo.menuItems = model.data;
              sessionStorage.setItem('menuList', JSON.stringify(model.data));
            } else {
              this.menuInfo.menuItems = [];
              sessionStorage.setItem('menuList', '');
            }
          }
        );
  }

}
