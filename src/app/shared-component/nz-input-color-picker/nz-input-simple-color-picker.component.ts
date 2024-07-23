import { Self, Optional, Component, ElementRef, Input, TemplateRef, OnInit, viewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'app-nz-input-simple-color-picker',
  standalone: true,
  imports: [FormsModule, NzFormModule, NgxColorsModule],
  template: `
    <nz-form-item>
      <nz-form-label [nzFor]="itemId" [nzRequired]="required">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip">
        <ngx-colors #input ngx-colors-trigger
          [(ngModel)]="_value"
          [palette]="colorPalette"
          [hideColorPicker]="true"
          [hideTextInput]="true"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()">
        </ngx-colors>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: []
})
export class NzInputSimpleColorPickerComponent implements ControlValueAccessor, OnInit {

  control = viewChild.required(NzFormControlComponent);
  element = viewChild.required<ElementRef>('input');

  @Input() itemId: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  @Input() nzErrorTip?: string | TemplateRef<{$implicit: AbstractControl | NgModel;}>;

  @Input() colorPalette: Array<any> = [
    "#00BCD4",
    "#03A9F4",
    "#B2F35C",
  ];

  _value: any;

  onChange!: (value: any) => void;
  onTouched!: () => void;

  constructor(@Self()  @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    //this.control.nzValidateStatus = this.ngControl.control as AbstractControl;
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
    this.disabled = isDisabled;
  }

  focus(): void {
    this.element().nativeElement.focus();
  }

}
