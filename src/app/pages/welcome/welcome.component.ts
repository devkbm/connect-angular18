import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ButtonTemplate, NzButtonsComponent } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
import { NzInputCheckboxComponent } from 'src/app/shared-component/nz-input-checkbox/nz-input-checkbox.component';
import { NzInputCkeditorComponent } from 'src/app/shared-component/nz-input-ckeditor/nz-input-ckeditor.component';
import { NzInputSimpleColorPickerComponent } from 'src/app/shared-component/nz-input-color-picker/nz-input-simple-color-picker.component';
import { NzInputDateComponent } from 'src/app/shared-component/nz-input-date/nz-input-date.component';
import { NzInputDateTimeComponent } from 'src/app/shared-component/nz-input-datetime/nz-input-datetime.component';
import { NzInputDeptSelectComponent } from 'src/app/shared-component/nz-input-dept-select/nz-input-dept-select.component';
import { NzInputMobileComponent } from 'src/app/shared-component/nz-input-mobile/nz-input-mobile.component';
import { NzInputNumberCustomComponent } from 'src/app/shared-component/nz-input-number-custom/nz-input-number-custom.component';
import { NzInputRadioGroupComponent } from 'src/app/shared-component/nz-input-radio-group/nz-input-radio-group.component';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';
import { NzInputTextComponent } from 'src/app/shared-component/nz-input-text/nz-input-text.component';
import { NzInputTextareaComponent } from 'src/app/shared-component/nz-input-textarea/nz-input-textarea.component';
import { NzInputTreeSelectComponent } from 'src/app/shared-component/nz-input-tree-select/nz-input-tree-select.component';
import { DutyDateListComponent } from './duty-date-list.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzInputTextComponent,
    NzInputTextareaComponent,
    NzButtonsComponent,
    NzInputCheckboxComponent,
    NzInputCkeditorComponent,
    NzInputDateComponent,
    NzInputDateTimeComponent,
    NzInputDeptSelectComponent,
    NzInputMobileComponent,
    NzInputNumberCustomComponent,
    NzInputRadioGroupComponent,
    NzInputSelectComponent,
    NzInputTreeSelectComponent,
    NzInputSimpleColorPickerComponent,
    DutyDateListComponent
  ],
  templateUrl: './welcome.component.html',
  styles: `
  `
})
export class WelcomeComponent implements OnInit {

  title = 'angular-forms-example';
  fg!: FormGroup;

  selectList = [{value: 'HRM', label: 'HRM'}, {value: 'HRM2', label: 'HRM2'}]

  treeList: NzTreeNodeOptions[] = [
    {
      key: 'title1',
      title: '제목1',
      isLeaf: false,
      children: [
        {
          key: 'content1',
          title: '본문1',
          isLeaf: true
        },
        {
          key: 'content1',
          title: '본문2',
          isLeaf: true
        },
      ]
    },
    {
      key: 'title2',
      title: '제목2',
      isLeaf: false,
      children: [
      ]
    }
  ];

  btns: ButtonTemplate[] = [{
    text: 'test',
    click: (e: MouseEvent) => {
      console.log('test');
    },
    nzType: 'save'
  },{
    text: 'test2',
    click: (e: MouseEvent) => {
      console.log('test2');
    },
    nzType: 'delete',
    isDanger: true
  },{
    text: 'test3',
    click: (e: MouseEvent) => {
      console.log('test3');
    },
    isDanger: true,
    popConfirm: {
      title: 'confirm?',
      confirmClick: () => {
        console.log('confirm');
      },
      cancelClick: () => {
        console.log('cancel');
      }
    }
  }];

  constructor(private fb: FormBuilder) {
    this.fg = this.fb.group({
      input_text: ['test', [ Validators.required ]],
      input_textarea: ['text area', [ Validators.required ]],
      input_date: [formatDate(new Date(),'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'), [ Validators.required ]],
      input_number: [1, [ Validators.required ]],
      input_select: [null, [ Validators.required ]],
      input_treeselect: [null, [ Validators.required ]],
      input_deptselect: [null, [ Validators.required ]],
      input_color: [null]
    });
  }

  ngOnInit() {
  }

  custom_label(option: any, i: number): any {
    return option.label + ' ' + i;
  }

}
