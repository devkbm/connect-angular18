import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SessionManager } from 'src/app/core/session-manager';
import { ResponseObject } from 'src/app/core/model/response-object';
import { FormBase, FormType } from 'src/app/core/form/form-base';
import { ResponseList } from 'src/app/core/model/response-list';

import { WorkCalendar } from './work-calendar.model';
import { WorkCalendarMember } from './work-calendar-member.model';
import { WorkCalendarService } from './work-calendar.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from 'src/app/shared-component/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputSimpleColorPickerComponent } from 'src/app/shared-component/nz-input-color-picker/nz-input-simple-color-picker.component';


@Component({
  selector: 'app-work-calendar-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCrudButtonGroupComponent,
    NzInputSimpleColorPickerComponent,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
  ],
  template: `
    {{fg.getRawValue() | json}}
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

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="workCalendarId" label="CALEDNAR ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="workCalendarId" formControlName="workCalendarId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="workCalendarName" label="CALENDAR NAME" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="workCalendarName" formControlName="workCalendarName" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-nz-input-simple-color-picker
            formControlName="color"
            [itemId]="'color'"
            [colorPalette]="preset_colors"
            [required]="false" [nzErrorTip]="errorTpl">색상
          </app-nz-input-simple-color-picker>

          <!--
          <app-nz-input-color-picker
            formControlName="color"
            [itemId]="'color'"
            placeholder="색상을 입력해주세요."
            [required]="false" [nzErrorTip]="errorTpl">색상
          </app-nz-input-color-picker>
          -->
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="memberList" label="팀원" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="memberList" itemId="memberList"
                [options]="memberList" [opt_value]="'userId'" [opt_label]="'name'" [mode]="'tags'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(fg.controls.workCalendarId.value!)">
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
export class WorkCalendarFormComponent extends FormBase implements OnInit, AfterViewInit {

  workGroupList: any;
  memberList: any;
  color: any;
  preset_colors = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];

  //workCalendarName = viewChild.required<NzInputTextComponent>('workCalendarName');

  private workGroupService = inject(WorkCalendarService);

  override fg = inject(FormBuilder).group({
    workCalendarId    : new FormControl<number | null>({value: null, disabled: true}, { validators: [Validators.required] }),
    workCalendarName  : new FormControl<string | null>(null, { validators: [Validators.required] }),
    color             : new FormControl<string | null>(null),
    memberList        : new FormControl<any | null>(null)
  });

  ngOnInit(): void {
    this.getAllMember();

    this.newForm();
  }

  ngAfterViewInit(): void {
    //this.workCalendarName().focus();
  }

  newForm(): void {
    this.formType = FormType.NEW;

    this.fg.get('memberList')?.setValue([SessionManager.getUserId()]);
  }

  modifyForm(formData: WorkCalendar): void {
    this.formType = FormType.MODIFY;

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: number): void {
    this.workGroupService.getWorkGroup(id)
        .subscribe(
          (model: ResponseObject<WorkCalendar>) => {
            if (model.data) {
              this.modifyForm(model.data);
              this.color = model.data.color;
            } else {
              this.newForm();
            }
          }
        );
  }

  save(): void {
    this.workGroupService
        .saveWorkGroup(this.fg.getRawValue())
        .subscribe(
            (model: ResponseObject<WorkCalendar>) => {
              this.formSaved.emit(this.fg.getRawValue());
            }
        );
  }

  remove(id: number): void {
    this.workGroupService.deleteWorkGroup(id)
        .subscribe(
            (model: ResponseObject<WorkCalendar>) => {
              this.formDeleted.emit(this.fg.getRawValue());
            }
        );
  }

  getAllMember(): void {
    this.workGroupService.getMemberList()
        .subscribe(
            (model: ResponseList<WorkCalendarMember>) => {
              if (model.data) {
                  this.memberList = model.data;
              } else {
                  this.memberList = [];
              }
          }
        );
  }

  selectColor(color: any): void {
    this.fg.get('color')?.setValue(color);
  }

}
