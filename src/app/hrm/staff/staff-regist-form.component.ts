import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputRadioGroupComponent } from 'src/app/shared-component/nz-input-radio-group/nz-input-radio-group.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputRregnoComponent } from 'src/app/shared-component/nz-input-rregno/nz-input-rregno.component';

import { Component, OnInit, Output, EventEmitter, Input, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { StaffService } from './staff.service';
import { Staff } from './staff.model';
import { GlobalProperty } from 'src/app/core/global-property';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-staff-regist-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzFormModule, NzButtonModule, NzIconModule, NzAvatarModule, NzUploadModule, NzDividerModule,
    NzInputTextComponent, NzInputRadioGroupComponent, NzInputRregnoComponent, NzInputDateComponent
  ],
  template: `
    <!--{{fg.getRawValue() | json}}-->
    <!--{{formModel | json}}-->
    <!--{{fileList | json}}-->

    <form nz-form [formGroup]="fg" nzLayout="vertical" style="padding: 0px; margin: 0px;">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <div class="img">
            <nz-avatar class="avatar" [nzShape]="'square'" [nzSize]='96' [nzSrc]="imageUrl"></nz-avatar>
          </div>
        </div>
        <div nz-col>
            <nz-upload
                [nzAction]="upload.url"
                [nzWithCredentials]="true"
                [nzShowUploadList]="false"
                [nzHeaders]="upload.headers"
                [nzData]="upload.data"
                (nzChange)="handleChange($event)">
              <button nz-button nzType="default" nzShape="round">
                <span nz-icon nzType="upload"></span>
              </button>
            </nz-upload>
            <button nz-button nzType="default" nzShape="round" (click)="downloadImage($event)"><span nz-icon nzType="download"></span></button>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="staffNo" itemId="staffNo"
            placeholder=""
            [required]="true" [readonly]="true" [nzErrorTip]="errorTpl">직원번호
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="name" itemId="name"
            placeholder=""
            [required]="true" [nzErrorTip]="errorTpl">직원명
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-radio-group
            formControlName="gender" itemId="gender"
            placeholder=""
            [options]="genderOptions"
            [required]="false" [nzErrorTip]="errorTpl">성별
          </app-nz-input-radio-group>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="nameEng" itemId="nameEng"
            placeholder=""
            [required]="false" [nzErrorTip]="errorTpl">직원명(영문)
          </app-nz-input-text>
        </div>

        <div nz-col nzSpan="8">
          <app-nz-input-text
            formControlName="nameChi" itemId="nameChi"
            placeholder=""
            [required]="false" [nzErrorTip]="errorTpl">직원명(한문)
          </app-nz-input-text>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12" >
          <app-nz-input-rregno
            formControlName="residentRegistrationNumber" itemId="residentRegistrationNumber"
            placeholder=""
            [required]="false" [readonly]="true" [nzErrorTip]="errorTpl">주민등록번호
          </app-nz-input-rregno>
        </div>

        <div nz-col nzSpan="12">
          <app-nz-input-date
            formControlName="birthday" itemId="birthday"
            [required]="true" [nzErrorTip]="errorTpl">생년월일
          </app-nz-input-date>
        </div>
      </div>
    </form>
    <nz-divider></nz-divider>

    <!--
    <div>
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(fg.get('staffId')?.value)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(this.fg.get('id')?.value)">
      </app-nz-crud-button-group>
    </div>
    -->

  `,
  styles: [``]
})
export class StaffRegistFormComponent extends FormBase implements OnInit {

  @Input() staffNo?: string;

  imageUrl: string = '';

  upload: {url: string, headers:any, data: any} = {
    url: GlobalProperty.serverUrl + '/api/hrm/staff/changeimage',
    headers: { Authorization: sessionStorage.getItem('token') },
    data: null
  }

  genderOptions = [
    {label: '남', value: 'M'},
    {label: '여', value: 'F'}
  ];

  private fb = inject(FormBuilder);
  private service = inject(StaffService);
  private appAlarmService = inject(AppAlarmService);

  override fg = this.fb.group({
    companyCode            : new FormControl<string | null>(null, { validators: Validators.required }),
    staffNo                     : new FormControl<string | null>(null, { validators: Validators.required }),
    name                        : new FormControl<string | null>(null, { validators: Validators.required }),
    nameEng                     : new FormControl<string | null>(null),
    nameChi                     : new FormControl<string | null>(null),
    residentRegistrationNumber  : new FormControl<string | null>(null),
    gender                      : new FormControl<string | null>(null),
    birthday                    : new FormControl<Date | null>(null),
    workCondition               : new FormControl<string | null>(null),
    imagePath                   : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.newForm();
  }

  newForm(): void {
    this.formType = FormType.NEW;

    this.fg.reset();
  }

  modifyForm(formData: Staff): void {
    this.formType = FormType.MODIFY;

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string): void {
    this.service
        .get(staffId)
        .subscribe(
          (model: ResponseObject<Staff>) => {
            if ( model.total > 0 ) {
              this.modifyForm(model.data);

              this.upload.data = { companyCode: model.data.companyCode, staffNo: model.data.staffNo };

              if (model.data.imagePath) {
                this.imageUrl = GlobalProperty.serverUrl + '/api/system/fileimage/' + model.data.imagePath;
              } else {
                this.imageUrl = '';
              }
            } else {
              this.newForm();
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  save(): void {
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<Staff>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(id: any): void {
    /*this.appointmentCodeService
        .deleteAppointmentCodeDetail(this.fg.get('code').value)
        .subscribe(
            (model: ResponseObject<AppointmentCodeDetail>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
            },
            (err) => {
            console.log(err);
            },
            () => {}
        );*/
  }

  handleChange(param: NzUploadChangeParam): void {
    console.log(param);
    if (param.type === 'success') {
      const serverFilePath = param.file.response.data;
      this.imageUrl = GlobalProperty.serverUrl + '/api/system/fileimage/' + this.findFileName(serverFilePath);
    }
  }

  private findFileName(path: string): string {
    const names: string[] = path.split("\\");
    return names[names.length-1];
  }

  downloadImage(params: any): void {

    this.service
        .downloadStaffImage(this.fg.controls.staffNo.value!)
        .subscribe(
          (model: Blob) => {
            //this.appAlarmService.changeMessage(model.message);
            const blob = new Blob([model], { type: 'application/octet-stream' });
            saveAs(blob, this.fg.get('staffNo')?.value+".jpg");

          }
        );
  }

}
