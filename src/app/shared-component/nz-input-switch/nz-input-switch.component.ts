import { Self, Optional, Component, TemplateRef, viewChild, effect, input, model } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-nz-input-switch',
  standalone: true,
  imports: [FormsModule, NzFormModule, NzSwitchModule],
  template: `
   <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()">
        <nz-switch
          [nzId]="itemId()"
          [nzDisabled]="_disabled"
          [ngModel]="_value()"
          (ngModelChange)="onChange($event)"
          (ngModelChange)="valueChange($event)"
          (blur)="onTouched()">
        </nz-switch>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: []
})
export class NzInputSwitchComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent);

  parentFormGroup = input<FormGroup>();
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

  valueChange(val: any) {
    //console.log(val);
  }

}

