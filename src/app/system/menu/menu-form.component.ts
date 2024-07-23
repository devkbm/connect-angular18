import { Component, OnInit, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';

import { MenuService } from './menu.service';
import { Menu } from './menu.model';
import { MenuHierarchy } from './menu-hierarchy.model';
import { MenuGroup } from './menu-group.model';
import { existingMenuValidator } from './menu-duplication-validator.directive';
import { CommonModule } from '@angular/common';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzTreeSelectCustomComponent } from 'src/app/shared-component/nz-tree-select-custom/nz-tree-select-custom.component';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzCrudButtonGroupComponent, NzInputTextComponent,
    NzInputTextareaComponent, NzInputNumberCustomComponent, NzInputSelectComponent, NzTreeSelectCustomComponent
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
          <app-nz-input-select
            formControlName="menuGroupCode" itemId="menuGroupCode"
            (ngModelChange)="selectMenuGroup($event)"
            [options]="menuGroupList" [opt_value]="'menuGroupCode'" [opt_label]="'menuGroupName'"
            [placeholder]="'Please select'" [nzErrorTip]="errorTpl" [required]="true">메뉴그룹
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="12">
          <!--상위메뉴코드 필드-->
          <app-nz-tree-select-custom
            formControlName="parentMenuCode" itemId="parentMenuCode"
            [nodes]="menuHiererachy"
            [placeholder]="'상위 메뉴 없음'">상위 메뉴
          </app-nz-tree-select-custom>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text #menuCode
            formControlName="menuCode" itemId="menuCode"
            placeholder="메뉴코드를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">메뉴코드
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="menuName" itemId="menuName"
            placeholder="메뉴명을 입력해주세요."
            [nzErrorTip]="errorTpl" [required]="true">메뉴명
          </app-nz-input-text>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-select
            formControlName="menuType" itemId="menuType"
            [options]="menuTypeList" [opt_value]="'value'" [opt_label]="'label'"
            [placeholder]="'메뉴타입을 선택해주세요'" [nzErrorTip]="errorTpl" [required]="true">메뉴타입
          </app-nz-input-select>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-text
            formControlName="appUrl" itemId="appUrl"
            placeholder="URL을 입력해주세요."
            [nzErrorTip]="errorTpl" [required]="true">APP URL
          </app-nz-input-text>
        </div>
      </div>

      <!-- 4 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-number-custom
            formControlName="sequence" itemId="sequence"
            placeholder="순번을 입력해주세요."
            [nzErrorTip]="errorTpl" [required]="true">순번
          </app-nz-input-number-custom>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>

  `,
  styles: [`
    [nz-button] {
      margin-right: 8px;
    }

    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    }

    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }


  `]
})
export class MenuFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  menuCode = viewChild.required<NzInputTextComponent>('menuCode');

  @Input() menuGroupId: any;

  programList: any;
  menuGroupList: any;
  menuTypeList: any;

  /**
   * 상위 메뉴 트리
   */
  menuHiererachy: MenuHierarchy[] = [];

  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
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

  newForm(): void {
    this.formType = FormType.NEW;

    this.getMenuHierarchy(this.menuGroupId);

    this.fg.controls.menuGroupCode.setValue(this.menuGroupId);
    //this.fg.controls.menuCode.disable();

    this.menuCode().focus();
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
