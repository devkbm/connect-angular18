import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { MenuService } from './menu.service';
import { Menu } from './menu.model';
import { MenuHierarchy } from './menu-hierarchy.model';
import { MenuGroup } from './menu-group.model';
import { existingMenuValidator } from './menu-duplication-validator.directive';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormItemCustomComponent } from "../../shared-component/nz-form-item-custom/nz-form-item-custom.component";
import { NzInputSelectComponent } from "../../shared-component/nz-input-select/nz-input-select.component";
import { NzInputTreeSelectComponent } from "../../shared-component/nz-input-tree-select/nz-input-tree-select.component";

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
    NzInputTreeSelectComponent
],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="menuGroupCode" label="메뉴그룹코드" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required="true"
                formControlName="menuGroupCode" itemId="menuGroupCode"
                (ngModelChange)="selectMenuGroup($event)"
                [options]="menuGroupList" [opt_value]="'menuGroupCode'" [opt_label]="'menuGroupName'"
                placeholder="Please select"
              >
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="parentMenuCode" label="상위 메뉴" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-tree-select
                formControlName="parentMenuCode" itemId="parentMenuCode"
                [nodes]="menuHiererachy"
                placeholder="상위 메뉴 없음">
              </nz-input-tree-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="menuCode" label="메뉴코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuCode" formControlName="menuCode" required
                placeholder="메뉴코드를 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="menuName" label="메뉴명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuName" formControlName="menuName" required
                placeholder="메뉴명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="menuType" label="메뉴타입" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required="true"
                formControlName="menuType" itemId="menuType"
                [options]="menuTypeList" [opt_value]="'value'" [opt_label]="'label'"
                placeholder="메뉴타입을 선택해주세요">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="appUrl" label="APP URL" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="appUrl" formControlName="appUrl" required
                placeholder="URL을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 4 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="sequence" label="순번" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999" placeholder="순번을 입력해주세요.">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class MenuFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  //menuCode = viewChild.required<NzInputTextComponent>('menuCode');

  @Input() menuGroupId: any;

  programList: any;
  menuGroupList: any;
  menuTypeList: any;

  /**
   * 상위 메뉴 트리
   */
  menuHiererachy: MenuHierarchy[] = [];

  private menuService = inject(MenuService);
  private appAlarmService = inject(AppAlarmService);
  private renderer = inject(Renderer2);

  override fg = inject(FormBuilder).group({
      menuGroupCode       : new FormControl<string | null>(null, { validators: Validators.required }),
      menuCode            : new FormControl<string | null>(null, {
        validators: Validators.required,
        asyncValidators: [existingMenuValidator(this.menuService)],
        updateOn: 'blur'
      }),
      menuName          : new FormControl<string | null>(null, { validators: Validators.required }),
      menuType          : new FormControl<string | null>(null, { validators: Validators.required }),
      parentMenuCode    : new FormControl<string | null>(null),
      sequence          : new FormControl<number | null>(null),
      appUrl            : new FormControl<string | null>(null, { validators: Validators.required })
    });

  ngOnInit() {
    this.getMenuTypeList();
    this.getMenuGroupList();
  }

  ngAfterViewInit(): void {
    if (this.initLoadId) {
      this.get(this.initLoadId.menuGroupCode, this.initLoadId.menuCode);
    } else {
      this.newForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
  }

  focusInput() {
    this.renderer.selectRootElement('#menuCode').focus();
  }

  newForm(): void {
    this.formType = FormType.NEW;

    this.getMenuHierarchy(this.menuGroupId);

    this.fg.controls.menuGroupCode.setValue(this.menuGroupId);
    //this.fg.controls.menuCode.disable();

    this.focusInput();
  }

  modifyForm(formData: Menu): void {
    this.formType = FormType.MODIFY;

    this.getMenuHierarchy(formData.menuGroupCode!);
    this.fg.controls.menuCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(menuGroupCode: string, menuCode: string) {

    this.menuService
        .getMenu(menuGroupCode, menuCode)
        .subscribe(
          (model: ResponseObject<Menu>) => {
            if ( model.total > 0 ) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save() {
    /*
    if (this.fg.invalid) {
      this.checkForm()
      return;
    }
    */

    this.menuService
        .registerMenu(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<Menu>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove(): void {
    this.menuService
        .deleteMenu(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<Menu>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  getMenuHierarchy(menuGroupId: string): void {
    if (!menuGroupId) return;

    this.menuService
        .getMenuHierarchy(menuGroupId)
        .subscribe(
          (model: ResponseList<MenuHierarchy>) => {
            if ( model.total > 0 ) {
              this.menuHiererachy = model.data;
            } else {
              this.menuHiererachy = [];
            }
          }
        );
  }

  getMenuGroupList(): void {
    this.menuService
        .getMenuGroupList()
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            if (model.total > 0) {
              this.menuGroupList = model.data;
            } else {
              this.menuGroupList = [];
            }
          }
        );
  }

  getMenuTypeList(): void {
    this.menuService
        .getMenuTypeList()
        .subscribe(
          (model: ResponseList<any>) => {
            if (model.total > 0) {
              this.menuTypeList = model.data;
            } else {
              this.menuTypeList = [];
            }
          }
        );
  }

  selectMenuGroup(menuGroupId: any): void {
    if (!menuGroupId) return;

    this.getMenuHierarchy(menuGroupId);
  }

}
