import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzListRoadAddressComponent } from 'src/app/shared-component/nz-list-road-address/nz-list-road-address.component';

import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { StaffContactService } from './staff-contact.service';
import { StaffContact } from './staff-contact.model';


@Component({
  selector: 'app-staff-contact-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule, NzDividerModule,
    NzInputTextComponent, NzListRoadAddressComponent, NzCrudButtonGroupComponent
  ],
  template: `
    <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()">
    </app-nz-crud-button-group>

    {{fg.getRawValue() | json}} - {{fg.valid}}
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
      <!--
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text #staffId
             formControlName="staffId" itemId="contact_staffId"
            placeholder="직원ID를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원ID
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
             formControlName="staffNo" itemId="contact_staffNo"
            placeholder="직원번호를 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
             formControlName="staffName" itemId="contact_staffName"
            placeholder="직원명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">직원명
          </app-nz-input-text>
        </div>
      </div>
      -->

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="2">
          <app-nz-input-text
             formControlName="homePostNumber" itemId="contact_homePostNumber"
            placeholder="우편번호를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">우편번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-text
             formControlName="homeMainAddress" itemId="contact_homeMainAddress"
            placeholder="기본주소를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">기본주소
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="10">
          <app-nz-input-text
             formControlName="homeSubAddress" itemId="contact_homeSubAddress"
            placeholder="상세주소를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">상세주소
          </app-nz-input-text>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text
             formControlName="extensionNumber" itemId="contact_extensionNumber"
            placeholder="내선번호를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">내선번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
             formControlName="mobileNumber" itemId="contact_mobileNumber"
            placeholder="휴대번호를 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">휴대번호
          </app-nz-input-text>
        </div>
      </div>

    </form>

    <nz-divider nzText="주소 검색"></nz-divider>

    <app-nz-list-road-address
      [height]="'300px'"
      [countPerPage]="5"
      (itemClicked)="changeRoadAddress($event)">
    </app-nz-list-road-address>

  `,
  styles: [`
    .footer {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      padding: 10px 16px;
      border-top: 1px solid rgb(232, 232, 232);
      text-align: right;
      /*background-color: black;*/
    }
  `]
})
export class StaffContactFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {

  @Input() staff?: {companyCode: string, staffNo: string, staffName: string};

  private fb = inject(FormBuilder);
  private service = inject(StaffContactService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    //staffId           : new FormControl<string | null>(null, { validators: Validators.required }),
    staffNo           : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName         : new FormControl<string | null>(null, { validators: Validators.required }),
    homeAddressType   : new FormControl<string | null>(null, { validators: Validators.required }),
    homePostNumber    : new FormControl<string | null>(null, { validators: Validators.required }),
    homeMainAddress   : new FormControl<string | null>(null),
    homeSubAddress    : new FormControl<string | null>(null),
    extensionNumber   : new FormControl<string | null>(null),
    mobileNumber      : new FormControl<string | null>(null)
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staff'].currentValue) {
      this.get(changes['staff'].currentValue.staffNo);
    }
  }

  ngOnInit() {
    /*
    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
    */
  }

  ngAfterViewInit(): void {

  }

  newForm() {
    this.formType = FormType.NEW;

    this.fg.controls.homePostNumber.disable();
    this.fg.controls.homeMainAddress.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff?.staffNo);
      this.fg.controls.staffName.setValue(this.staff?.staffName);
    }
  }


  modifyForm(formData: StaffContact) {
    this.formType = FormType.MODIFY;

    this.fg.controls.homePostNumber.disable();
    this.fg.controls.homeMainAddress.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff?.staffNo);
      this.fg.controls.staffName.setValue(this.staff?.staffName);
    }

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string): void {
    this.service
        .get(staffId)
        .subscribe(
          (model: ResponseObject<StaffContact>) => {
            if (model.total > 0) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save() {
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<StaffContact>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  // {roadAddress: string, zipNo: string}
  changeRoadAddress(item: any) {
    this.fg.get('homeMainAddress')?.setValue(item.roadAddress);
    this.fg.get('homePostNumber')?.setValue(item.zipNo);
    this.fg.get('homeSubAddress')?.setValue(null);
  }

}
