import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzDeptTreeSelectComponent } from 'src/app/shared-component/nz-dept-tree-select/nz-dept-tree-select.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { UserImageUploadComponent } from './user-image-upload.component';
import { NzInputSwitchComponent } from 'src/app/shared-component/nz-input-switch/nz-input-switch.component';

import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormType, FormBase } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { UserService } from './user.service';
import { User } from './user.model';
import { Role } from '../role/role.model';

import { existingUserValidator } from './user-duplication-validator.directive';

import { DeptHierarchy } from '../dept/dept-hierarchy.model';
import { DeptService } from '../dept/dept.service';
import { GlobalProperty } from 'src/app/core/global-property';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule,
    UserImageUploadComponent, NzCrudButtonGroupComponent, NzInputTextComponent,
    NzDeptTreeSelectComponent, NzInputSelectComponent, NzInputSwitchComponent
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <!--{{fileList | json}}-->
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 아이디가 존재합니다.
        }
        @if (control.hasError('email')) {
          이메일을 확인해주세요.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row>
        <div nz-col nzSpan="4">
          <app-user-image-upload
            [userId]="this.fg.controls.userId.value!"
            [pictureFileId]="imageBase64">
          </app-user-image-upload>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="userId" itemId="userId"
            [required]="true" [readonly]="true" [nzErrorTip]="errorTpl">아이디
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="companyCode" itemId="companyCode"
            placeholder="조직코드를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">조직코드
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-text #staffNo
            formControlName="staffNo" itemId="staffNo"
            placeholder="직원번호를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="6">
          <app-nz-input-text
            formControlName="name" itemId="name"
            placeholder="이름을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">이름
          </app-nz-input-text>
        </div>

      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="4">
          <app-nz-input-switch formControlName="enabled" >
            사용여부
          </app-nz-input-switch>
        </div>

        <div nz-col nzSpan="10">
          <app-nz-input-text
            formControlName="mobileNum" itemId="mobileNum"
            placeholder="휴대폰 번호을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">휴대폰번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="10">
          <app-nz-input-text
            formControlName="email" itemId="email"
            placeholder=""
            [required]="true" [nzErrorTip]="errorTpl">이메일
          </app-nz-input-text>
        </div>

      </div>

      <!--<nz-divider nzPlain nzText="기타정보" nzOrientation="left"></nz-divider>-->

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-dept-tree-select
            formControlName="deptCode"
            placeholder="부서 없음">부서
          </app-nz-dept-tree-select>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <app-nz-input-select
            formControlName="roleList" itemId="formauth"
            [options]="authList" [opt_value]="'roleCode'" [opt_label]="'description'" [mode]="'tags'"
            [placeholder]="'Please select'"
            [nzErrorTip]="errorTpl" [required]="true">롤
          </app-nz-input-select>
        </div>
      </div>
    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [searchVisible]="false"
        [isSavePopupConfirm]="true"
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
export class UserFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  public authList: any;
  public deptHierarchy: DeptHierarchy[] = [];

  passwordConfirm: string = '';
  popup: boolean = false;

  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false
  };

  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl: string = GlobalProperty.serverUrl + '/api/system/user/image/';
  imageUploadHeader: any = {
    Authorization: sessionStorage.getItem('token')
    //'x-auth-token': sessionStorage.getItem('token')
    //'Content-Type': 'multipart/form-data'
  };
  uploadParam: any = {};

  imageBase64: any;

  staffNoField = viewChild.required<NzInputTextComponent>('staffNo');

  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private deptService = inject(DeptService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    userId: new FormControl<string | null>(null, {
      validators: Validators.required,
      asyncValidators: [existingUserValidator(this.service)],
      updateOn: 'blur'
    }),
    companyCode: new FormControl<string | null>({ value: null, disabled: true }, { validators: Validators.required }),
    staffNo: new FormControl<string | null>(null),
    name: new FormControl<string | null>({ value: null, disabled: false }, { validators: Validators.required }),
    enabled: new FormControl<boolean>(true),
    deptCode: new FormControl<string | null>(null),
    mobileNum: new FormControl<string | null>(null),
    email: new FormControl<string | null>({ value: null, disabled: false }, { validators: Validators.email }),
    imageBase64: new FormControl<string | null>(null),
    roleList: new FormControl<string[] | null>({ value: null, disabled: false }, { validators: Validators.required })
  });

  ngOnInit(): void {
    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }

    this.getAuthorityList();
    this.getDeptHierarchy();
  }

  ngAfterViewInit(): void {
    this.staffNoField().focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
  }

  newForm(): void {
    this.formType = FormType.NEW;
    this.imageBase64 = null;
    this.previewImage = '';

    this.fg.reset();

    this.fg.controls.userId.setAsyncValidators(existingUserValidator(this.service));
    this.fg.controls.companyCode.setValue(sessionStorage.getItem('companyCode'));
    this.fg.controls.staffNo.enable();
    this.fg.controls.enabled.setValue(true);

    this.fg.controls.staffNo.valueChanges.subscribe(x => {
      if (x === null) return;
      const companyCode = sessionStorage.getItem('companyCode');
      //this.fg.controls.userId.setValue(companyCode + x);
      this.fg.controls.userId.setValue(x);
      this.fg.controls.userId.markAsTouched();
    });
  }

  modifyForm(formData: User): void {
    this.formType = FormType.MODIFY;

    this.fg.controls.userId.setAsyncValidators(null);
    this.fg.controls.staffNo.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.value);
  }

  get(userId: string): void {
    this.service
        .getUser(userId)
        .subscribe(
          (model: ResponseObject<User>) => {
            if (model.total > 0) {
              if (model.data.userId == null) {
                this.newForm();
              } else {
                this.modifyForm(model.data);
              }

              if (model.data.imageBase64 != null) {
                //this.imageBase64 = 'data:image/jpg;base64,' + model.data.imageBase64;
                this.imageBase64 = model.data.imageBase64;
              } else {
                this.imageBase64 = '';
              }

            } else {
              this.fg.reset();
            }

            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save(): void {
    if (this.fg.invalid) {
      this.checkForm();
      return;
    }

    this.service
        .registerUser(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<User>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .deleteUser(this.fg.controls.userId.value!)
        .subscribe(
          (model: ResponseObject<User>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getAuthorityList(): void {
    this.service
        .getAuthorityList()
        .subscribe(
          (model: ResponseList<Role>) => {
            if (model.total > 0) {
              this.authList = model.data;
            }
          }
        );
  }

  getDeptHierarchy(): void {
    this.deptService
        .getDeptHierarchyList()
        .subscribe(
          (model: ResponseList<DeptHierarchy>) => {
            if (model.total > 0) {
              this.deptHierarchy = model.data;
            } else {
              this.deptHierarchy = [];
            }
          }
        );
  }

}
