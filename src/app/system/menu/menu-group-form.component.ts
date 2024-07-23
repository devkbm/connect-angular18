import { CommonModule } from '@angular/common';

import { Component, OnInit, AfterViewInit, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';

import { MenuService } from './menu.service';
import { MenuGroup } from './menu-group.model';
import { existingMenuGroupValidator } from './menu-group-duplication-validator.directive';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';

@Component({
  selector: 'app-menu-group-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzCrudButtonGroupComponent, NzInputTextComponent, NzInputTextareaComponent
  ],
  template: `
    {{fg.value | json}}
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

      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text #menuGroupCode
            formControlName="menuGroupCode" itemId="menuGroupCode"
            placeholder="메뉴그룹코드를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">메뉴그룹코드
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="menuGroupName" itemId="menuGroupName"
            placeholder="메뉴그룹명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">메뉴그룹명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="menuGroupUrl" itemId="menuGroupUrl"
            placeholder="메뉴그룹URL을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">메뉴그룹URL
          </app-nz-input-text>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-textarea
            formControlName="description" itemId="description"
            placeholder="비고를 입력해주세요."
            [rows]="25">비고
          </app-nz-input-textarea>
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
export class MenuGroupFormComponent extends FormBase implements OnInit, AfterViewInit {

  menuGroupCode = viewChild.required<NzInputTextComponent>('menuGroupCode');

  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    /*
    menuGroupId     : new FormControl<string | null>(null, {
      validators: Validators.required,
      asyncValidators: [existingMenuGroupValidator(this.menuService)],
      updateOn: 'blur'
    }),*/
    menuGroupCode   : new FormControl<string | null>(null, { validators: Validators.required }),
    menuGroupName   : new FormControl<string | null>(null, { validators: Validators.required }),
    menuGroupUrl    : new FormControl<string | null>(null, { validators: Validators.required }),
    description     : new FormControl<string | null>(null)
  });

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  newForm(): void {
    this.formType = FormType.NEW;
    this.fg.reset();

    this.fg.controls.menuGroupCode.enable();
    this.menuGroupCode().focus();
  }

  modifyForm(formData: MenuGroup): void {
    this.formType = FormType.MODIFY;
    this.fg.controls.menuGroupCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(menuGroupId: string) {
    this.menuService
        .getMenuGroup(menuGroupId)
        .subscribe(
          (model: ResponseObject<MenuGroup>) => {
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
        .registerMenuGroup(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<MenuGroup>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove() {
    this.menuService
        .deleteMenuGroup(this.fg.controls.menuGroupCode.value!)
        .subscribe(
          (model: ResponseObject<MenuGroup>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.total + '건의 메뉴그룹이 삭제되었습니다.');
          }
        );
  }

}
