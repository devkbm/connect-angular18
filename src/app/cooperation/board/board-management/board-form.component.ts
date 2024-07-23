import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputTreeSelectComponent } from 'src/app/shared-component/nz-input-tree-select/nz-input-tree-select.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzCrudButtonGroupComponent } from 'src/app/shared-component/nz-crud-button-group/nz-crud-button-group.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { BoardManagementService } from './board-management.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { BoardManagement } from './board-management.model';
import { BoardHierarchy } from '../board-hierarcy/board-hierarchy.model';
import { ResponseList } from 'src/app/core/model/response-list';
import { FormBase, FormType } from 'src/app/core/form/form-base';


@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzFormModule, NzInputTextComponent, NzInputTextareaComponent, NzInputSelectComponent,
    NzInputTreeSelectComponent, NzCrudButtonGroupComponent,
    NzButtonModule, NzDividerModule, NzIconModule
  ],
  template: `
    <div>{{fg.getRawValue() | json}}</div>

    <!--
    <button nz-button (click)="get(this.fg.value.boardId!)">
      <span nz-icon nzType="search"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
-->
    <button nz-button (click)="newForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzType="primary" (click)="save()">
      <span nz-icon nzType="save" nzTheme="outline"></span>저장
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <!--
    <button nz-button (click)="closeForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>닫기
    </button>
-->
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzDanger (click)="remove()">
      <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
    </button>

    <!--
    <app-nz-crud-button-group
      [isSavePopupConfirm]="false"
      (searchClick)="get(this.fg.value.boardId!)"
      (closeClick)="closeForm()"
      (saveClick)="save()"
      (deleteClick)="remove()">
    </app-nz-crud-button-group>
    -->

    <!-- ERROR TEMPLATE-->
    <ng-template #errorTpl let-control>
      @if (control.hasError('required')) {
        필수 입력 값입니다.
      }
    </ng-template>

    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <!--상위 게시판 필드-->
          <app-nz-input-tree-select
            formControlName="boardParentId"
            [nodes]="parentBoardItems"
            [placeholder]="'상위 게시판 없음'" [nzErrorTip]="errorTpl" [required]="false">상위 게시판
          </app-nz-input-tree-select>
        </div>

        <div nz-col nzSpan="12">
          <!--게시판타입 필드-->
          <app-nz-input-select
            formControlName="boardType"
            [options]="boardTypeList" [opt_value]="'value'" [opt_label]="'label'"
            [placeholder]="'게시판타입을 선택해주세요.'" [nzErrorTip]="errorTpl" [required]="true">게시판타입
          </app-nz-input-select>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <!--게시판명 필드-->
          <app-nz-input-text #boardName
            formControlName="boardName"
            [itemId]="'boardName'"
            placeholder="게시판명을 입력해주세요."
            [required]="true" [nzErrorTip]="errorTpl">게시판 명
          </app-nz-input-text>
        </div>
      </div>

      <!--게시판설명 필드-->
      <app-nz-input-textarea
        formControlName="boardDescription"
        [itemId]="'boardDescription'"
        placeholder="게시판 설명을 입력해주세요."
        [rows] = "20"
        [required]="false" [nzErrorTip]="errorTpl">게시판 설명
      </app-nz-input-textarea>

    </form>

    <!--
    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(this.fg.value.boardId!)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>
    -->
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
export class BoardFormComponent extends FormBase implements OnInit, OnChanges, AfterViewInit {

  boardName = viewChild.required<NzInputTextComponent>('boardName');

  parentBoardItems: BoardHierarchy[] = [];

  boardTypeList: any;

  private fb = inject(FormBuilder);
  private service = inject(BoardManagementService);

  override fg = this.fb.group({
    boardId         : new FormControl<string | null>(null),
    boardParentId   : new FormControl<string | null>(null),
    boardName       : new FormControl<string | null>('', { validators: [Validators.required] }),
    boardType       : new FormControl<string | null>('', { validators: [Validators.required] }),
    boardDescription: new FormControl<string | null>(null)
  });

  ngOnInit() {
    this.getboardHierarchy();
    this.getBoardTypeList();

    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
    this.boardName().focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initLoadId']?.currentValue) {
      console.log(this.initLoadId);
      this.get(this.initLoadId);
    }
  }

  newForm(): void {
    this.formType = FormType.NEW;

    this.fg.reset();
    this.fg.controls.boardId.enable();
    this.fg.controls.boardType.setValue('BOARD');

    this.boardName().focus();
  }

  modifyForm(formData: BoardManagement): void {
    this.formType = FormType.MODIFY;

    this.fg.controls.boardId.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    this.service.getBoard(id)
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            if (model.data) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
          }
        );
  }

  save(): void {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      return;
    }

    this.service
        .saveBoard(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .deleteBoard(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            console.log(model);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getboardHierarchy(): void {
    this.service
        .getBoardHierarchy()
        .subscribe(
          (model: ResponseList<BoardHierarchy>) => {
            if ( model.total > 0 ) {
              this.parentBoardItems = model.data;
            } else {
              this.parentBoardItems = [];
            }
            //this.appAlarmService.changeMessage(model.message);
            // title 노드 텍스트
            // key   데이터 키
            // isLeaf 마지막 노드 여부
            // checked 체크 여부
          }
        );
  }

  getBoardTypeList(): void {
    this.service
        .getBoardTypeList()
        .subscribe(
          (model: ResponseObject<any>) => {
            if (model.data) {
              this.boardTypeList = model.data;
            } else {
              this.boardTypeList = [];
            }
          }
        );
  }

}
