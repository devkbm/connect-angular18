import { FormGroup } from '@angular/forms';
import { Component, Input, output } from '@angular/core';

export enum FormType {
    NEW = 'NEW',
    MODIFY = 'MODIFY'
}
@Component({
  template : ''
})
export abstract class FormBase {

  formType: FormType = FormType.NEW;
  fg: FormGroup = new FormGroup({});

  @Input() initLoadId: any;

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  /**
   *
   * @param formGroup 폼그룹
   * @param fieldName 필드명
   * @param errorName 에러명
   */
  isFieldErrors(formGroup: FormGroup, fieldName: string, errorName: string): boolean {
      return formGroup.get(fieldName)?.dirty
          && formGroup.get(fieldName)?.hasError(errorName) ? true : false;
  }

  checkForm() {
    for (const i in this.fg.controls) {
      this.fg.controls[i].markAsDirty();
      this.fg.controls[i].updateValueAndValidity({onlySelf: true});
    }
  }

}
