import { Self, Optional, Component, ElementRef, TemplateRef, viewChild, input, model, effect } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';
import { ColorPickerModule } from 'ngx-color-picker';

// https://zefoy.github.io/ngx-color-picker/

@Component({
  selector: 'app-nz-input-color-picker',
  standalone: true,
  imports: [FormsModule, NzFormModule,ColorPickerModule],
  template: `
    <!--{{formField.errors | json}}-->
    <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()">
      <input #input nz-input
            [cpPresetColors]="preset_colors"
            [ngModel]="_value()"
            [colorPicker]="_value()"
            [style.background]="_value"
            [cpAlphaChannel]="'always'"
            [cpOutputFormat]="'hex'"
            [cpOKButton]="true"
            [required]="required()"
            [disabled]="_disabled"
            [placeholder]="placeholder"
            (colorPickerChange)="onChange($event)"
            (ngModelChange)="valueChange($event)"
            (blur)="onTouched()"
            />
      </nz-form-control>
    </nz-form-item>
  `,
  styles: []
})
export class NzInputColorPickerComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent);
  element = viewChild.required<ElementRef<HTMLInputElement>>('input');

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  readonly = input<boolean>(false);

  nzErrorTip = input<string | TemplateRef<{$implicit: AbstractControl | NgModel;}>>();

  color: any;
  preset_colors = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];


  // https://ngx-colors.web.app/examples 로변경?
  _disabled = false;
  _value = model.required<string>();

  onChange!: (value: any) => void;
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
    this._value.set(val);
    //const nativeValue = this.element?.pickerInput?.nativeElement.value;
    //console.log('nativeValue: ' + nativeValue);
  }

}
