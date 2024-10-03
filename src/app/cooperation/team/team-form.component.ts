import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBase, FormType } from 'src/app/core/form/form-base';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { TeamService } from './team.service';
import { TeamJoinableUserModel, TeamModel } from './team.model';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from 'src/app/shared-component/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCrudButtonGroupComponent,
    NzFormItemCustomComponent,
    NzInputSelectComponent
  ],
  template: `
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
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="teamId" label="팀ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="teamId" formControlName="teamId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="teamName" label="팀명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="teamName" formControlName="teamName" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="memberList" label="팀원" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="memberList" itemId="memberList"
                [options]="members" [opt_value]="'userId'" [opt_label]="'name'" [mode]="'multiple'"
                placeholder="팀원을 선택해주세요.">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>
    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [searchVisible]="false"
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
export class TeamFormComponent extends FormBase implements OnInit, AfterViewInit, OnChanges {
  //teamName = viewChild.required<NzInputTextComponent>('teamName');

  members: TeamJoinableUserModel[] = [];

  private service = inject(TeamService);
  private appAlarmService = inject(AppAlarmService);

  override fg = inject(FormBuilder).group({
    teamId      : new FormControl<string | null>(null, { validators: [Validators.required] }),
    teamName    : new FormControl<string | null>(null, { validators: [Validators.required] }),
    memberList  : new FormControl<string[] | null>(null)
  });

  ngOnInit() {
    this.getMembers();

    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
    if (this.formType === FormType.NEW) {
      //this.teamName().focus();
    } else {
      //this.teamName().focus();
    }


  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm(): void {
    this.formType = FormType.NEW;
    this.fg.reset();

    this.fg.controls.teamId.disable();

  }

  modifyForm(formData: TeamModel): void {
    this.formType = FormType.MODIFY;
    this.fg.controls.teamId.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<TeamModel>) => {
            if (model.data) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
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
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<TeamModel>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .remove(this.fg.getRawValue().teamId!)
        .subscribe(
          (model: ResponseObject<TeamModel>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getMembers() {
    this.service
        .getAllUserList()
        .subscribe(
          (model: ResponseList<TeamJoinableUserModel>) => {
            this.members = model.data;
          }
        )
  }

}
