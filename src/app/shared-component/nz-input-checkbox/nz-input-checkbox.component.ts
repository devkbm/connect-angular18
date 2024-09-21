import { Component, input, model } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-nz-input-checkbox',
  standalone: true,
  imports: [ FormsModule, NzFormModule, NzCheckboxModule ],
  template: `
    <label nz-checkbox
      [nzId]="itemId()"
      [nzDisabled]="_disabled"
      [ngModel]="_value"
      (ngModelChange)="onChange($event)"
      (ngModelChange)="valueChange($event)"
      (blur)="onTouched()">{{checkboxText()}}
    </label>
  `,
  styles: `
  `
})
export class NzInputCheckboxComponent implements ControlValueAccessor {

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  checkboxText = input<string>('');

  _disabled = false;
  _value = model();

  onChange!: (value: string) => void;
  onTouched!: () => void;

  writeValue(obj: any): void {
    this._value.set(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  valueChange(val: any) {
    //console.log(val);
  }
}
