import { Self, Optional, Component, ElementRef, TemplateRef, viewChild, effect, input, model } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormModule, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NgxMaskDirective, provideNgxMask, IConfig } from 'ngx-mask'
export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null;

// https://www.npmjs.com/package/ngx-mask

@Component({
  selector: 'app-nz-input-mobile',
  standalone: true,
  imports: [FormsModule, NzFormModule, NzInputModule, NgxMaskDirective],
  providers: [
    provideNgxMask()
  ],
  template: `
   <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()">
        <input #inputControl nz-input
              [required]="required()"
              [disabled]="_disabled"
              [id]="itemId()"
              [placeholder]="placeholder()"
              [ngModel]="_value()"
              [readonly]="readonly()"
              mask="000-0000-0000"
              (ngModelChange)="onChange($event)"
              (ngModelChange)="valueChange($event)"
              (blur)="onTouched()"/>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: []
})
export class NzInputMobileComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent);
  element = viewChild.required<ElementRef<HTMLInputElement>>('inputControl');

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  readonly = input<boolean>(false);

  nzErrorTip = input<string | TemplateRef<{$implicit: AbstractControl | NgModel;}>>();

  _disabled = false;
  _value = model();

  onChange!: (value: string) => void;
  onTouched!: () => void;

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
    this.element().nativeElement.focus();
  }

  valueChange(val: any) {
    //console.log(val);
  }

}
