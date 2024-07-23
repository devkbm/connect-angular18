import { Component, Self, Optional, TemplateRef, OnInit, input, model, effect, viewChild, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';

import { NzSelectModeType, NzSelectModule } from 'ng-zorro-antd/select';

import { ResponseList } from 'src/app/core/model/response-list';
import { NzInputDeptSelectModel } from './nz-input-dept-select.model';
import { NzInputDeptSelectService } from './nz-input-dept-select.service';

@Component({
  selector: 'app-nz-input-dept-select',
  standalone: true,
  imports: [FormsModule, NzFormModule, NzSelectModule],
  template: `
   <nz-form-item>
    <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
      <ng-content></ng-content>
    </nz-form-label>
    <nz-form-control [nzErrorTip]="nzErrorTip()">
      <nz-select
          [nzId]="itemId()"
          [ngModel]="_value()"
          [nzDisabled]="disabled()"
          [nzPlaceHolder]="placeholder()"
          [nzMode]="mode()"
          nzShowSearch
          (blur)="onTouched()"
          (ngModelChange)="onChange($event)">
          @for (option of deptList; track option[opt_value()]) {
            <nz-option
              [nzLabel]="option[opt_label()]"
              [nzValue]="option[opt_value()]">
            </nz-option>
          }
        </nz-select>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: []
})
export class NzInputDeptSelectComponent implements ControlValueAccessor, OnInit {

  control = viewChild.required(NzFormControlComponent);

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  opt_label = input<string>('deptNameKorean');
  opt_value = input<'deptId' | 'deptCode'>('deptCode');
  mode = input<NzSelectModeType>('default');

  nzErrorTip = input<string | TemplateRef<{$implicit: AbstractControl | NgModel;}>>();

  onChange!: (value: string) => void;
  onTouched!: () => void;

  _disabled = false;
  _value = model();

  deptList: NzInputDeptSelectModel[] = [];

  private service = inject(NzInputDeptSelectService);

  constructor(@Self()  @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      if (this.control()) {
        this.control().nzValidateStatus = this.ngControl.control as AbstractControl;
      }
    })
  }

  ngOnInit(): void {
    this.getDeptList();
  }

  writeValue(obj: any): void {
    this._value.set(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  getDeptList(): void {
    const params = {isEnabled: true};

    this.service
         .getDeptList(params)
         .subscribe(
          (model: ResponseList<NzInputDeptSelectModel>) => {
            this.deptList = model.data;
          }
      );
  }

}
