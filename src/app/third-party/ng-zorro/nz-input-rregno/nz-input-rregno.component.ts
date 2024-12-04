import { Self, Optional, Component, ElementRef, viewChild, input, model } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';

import { NgxMaskDirective, provideNgxMask, IConfig } from 'ngx-mask'
export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null;

@Component({
  selector: 'nz-input-rregno',
  standalone: true,
  imports: [FormsModule, NzInputModule, NgxMaskDirective],
  providers: [
    provideNgxMask()
  ],
  template: `
    <input #inputControl nz-input
          [required]="required()"
          [disabled]="_disabled"
          [id]="itemId()"
          [placeholder]="placeholder()"
          [ngModel]="_value()"
          [readonly]="readonly()"
          mask="000000-0000000"
          (ngModelChange)="onChange($event)"
          (ngModelChange)="valueChange($event)"
          (blur)="onTouched()"/>
  `,
  styles: []
})
export class NzInputRregnoComponent implements ControlValueAccessor {

  element = viewChild.required<ElementRef<HTMLInputElement>>('inputControl');

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  readonly = input<boolean>(false);

  _disabled = false;
  _value = model();

  onChange!: (value: string) => void;
  onTouched!: () => void;

  constructor(@Self()  @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: any): void {
    this._value.set(obj);
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
    this.element()?.nativeElement.focus();
  }

  valueChange(val: any) {
    //console.log(val);
  }

}