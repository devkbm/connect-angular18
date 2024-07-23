import { Self, Optional, Component, TemplateRef, viewChild, effect, input, model } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-nz-input-number-custom',
  standalone: true,
  imports: [FormsModule, NzFormModule, NzInputNumberModule],
  template: `
    <!--{{formField.errors | json}}-->
    <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()">
        <nz-input-number
          [nzId]="itemId()"
          [required]="required()"
          [nzDisabled]="_disabled"
          [nzPlaceHolder]="placeholder()"
          [(ngModel)]="_value"
          [nzMin]="1" [nzMax]="9999" [nzStep]="1"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()">
        </nz-input-number>
      </nz-form-control>
    </nz-form-item>
  `
})
export class NzInputNumberCustomComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent);

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');

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

}
