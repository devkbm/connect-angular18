import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { ResponseObject } from '../../../core/model/response-object';
import { FormBase, FormType } from 'src/app/core/form/form-base';

import { TeamService } from '../service/team.service';
import { Team } from '../model/team';
import { TeamMember } from '../model/team-member';
import { ResponseList } from 'src/app/core/model/response-list';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent extends FormBase implements OnInit {

  /**
   * Xs < 576px span size
   * Sm >= 576px span size
   */
  formLabelXs = 24;
  formControlXs = 24;

  formLabelSm = 24;
  fromControlSm = 24;

  form: FormGroup = new FormGroup({});

  memberList: TeamMember[] = [];

  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);

  ngOnInit() {
    this.getAllMember();

    this.newForm();
  }

  //#region public methods

  public newForm(): void {
    this.formType = FormType.NEW;

    this.form = this.fb.group({
      teamId        : new FormControl({value: null, disabled: true}),
      teamName      : [ null, [ Validators.required ] ],
      memberList    : [ null ]
    });

  }

  public modifyForm(formData: Team): void {
    this.formType = FormType.MODIFY;

    this.form = this.fb.group({
      teamId        : new FormControl({value: null, disabled: true}),
      teamName      : [ null, [ Validators.required ] ],
      memberList    : [ null ]
    });

    this.form.patchValue(formData);
  }

  public getTeam(id: number): void {
    this.teamService.getTeam(id)
      .subscribe(
        (model: ResponseObject<Team>) => {
          if (model.data) {
            this.modifyForm(model.data);
          } else {
            this.newForm();
          }
        },
        (err) => {},
        () => {}
    );
  }

  public saveTeam(): void {
    console.log(this.form.getRawValue());
    this.teamService
      .saveTeam(this.form.getRawValue())
      .subscribe(
        (model: ResponseObject<Team>) => {
          this.formSaved.emit(this.form.getRawValue());
        },
        (err) => {
          console.log(err);
        },
        () => {
          console.log('완료');
        }
      );
  }

  public deleteTeam(id: number): void {
    this.teamService.deleteTeam(id)
      .subscribe(
        (model: ResponseObject<Team>) => {
            this.formDeleted.emit(this.form.getRawValue());
        },
        (err) => {},
        () => {}
    );
  }

  public closeForm() {
    this.formClosed.emit(this.form.getRawValue());
  }

  public getAllMember(): void {
    this.teamService.getAllMemberList()
      .subscribe(
        (model: ResponseList<TeamMember>) => {
          if (model.data) {
            this.memberList = model.data;
          } else {
            this.memberList = [];
          }
        },
        (err) => {},
        () => {}
    );
  }

  //#endregion

}
