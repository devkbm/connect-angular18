import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ButtonTemplate } from 'src/app/shared-component/nz-buttons/nz-buttons.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
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
