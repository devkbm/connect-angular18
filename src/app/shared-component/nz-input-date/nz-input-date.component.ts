import { Self, Optional, Component,  TemplateRef, viewChild, input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import * as dateFns from "date-fns";

@Component({
  selector: 'app-nz-input-date',
  standalone: true,
  imports: [FormsModule, NzDatePickerModule],
  template: `
    <!-- (ngModelChange)="onChange($event)" -->
    <nz-date-picker #inputControl
          [nzId]="itemId()"
          [nzPlaceHolder]="placeholder()"
          [required]="required()"
          [nzDisabled]="_disabled"
          [nzInputReadOnly]="readonly()"
          nzAllowClear="false"
          [(ngModel)]="_value"
          (ngModelChange)="valueChange($event)"
          (blur)="onTouched()">
    </nz-date-picker>
  `,
  styles: [`
    nz-date-picker {
      width: 140px
    }
  `]
})
export class NzInputDateComponent implements ControlValueAccessor {

  element = viewChild.required<NzDatePickerComponent>('inputControl');

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  readonly = input<boolean>(false);

  nzErrorTip = input<string | TemplateRef<{$implicit: AbstractControl | NgModel;}>>();

  _disabled = false;
  _value: any;

  onChange!: (value: string | null) => void;
  onTouched!: () => void;

  constructor(@Self()  @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  focus(): void {
    this.element().focus();
  }

  valueChange(val: Date) {
    this._value = val;
    const nativeValue = this.element().pickerInput?.nativeElement.value as string;
    // keyboard로 8자리 숫자입력 받을 경우 Date로 변환 처리
    if (nativeValue.length === 8) {
      this._value = this.convert(nativeValue);
    }

    if (this._value !== null) {
      this.onChange(dateFns.format(this._value, "yyyy-MM-dd"));
    } else {
      this.onChange(null);
      this.focus();
    }
  }

  convert(dateStr: string): Date | null {
    const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const convertValue = dateStr.replace(reg,'');

    if (dateStr.length >= 8) {
      const year = convertValue.substring(0,4);
      const month = convertValue.substring(4,6);
      const day = convertValue.substring(6,8);
      const dateStr = year + '-' + month + '-' + day;
      const dateNum = Date.parse(dateStr);
      // Validate Date String
      if (!isNaN(dateNum)) {
        return new Date(dateStr);
      }
    }

    return null;
  }

}
