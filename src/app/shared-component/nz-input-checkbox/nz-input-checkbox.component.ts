import { Self, Optional, Component, TemplateRef, viewChild, input, model, effect } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-nz-input-checkbox',
  standalone: true,
  imports: [FormsModule, NzFormModule, NzCheckboxModule],
  template: `
   <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()">
        <label nz-checkbox
          [nzId]="itemId()"
          [nzDisabled]="_disabled"
          [ngModel]="_value"
          (ngModelChange)="onChange($event)"
          (ngModelChange)="valueChange($event)"
          (blur)="onTouched()">{{checkboxText()}}
        </label>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: []
})
export class NzInputCheckboxComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent);

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  checkboxText = input<string>('');
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

  valueChange(val: any) {
    //console.log(val);
  }

}
