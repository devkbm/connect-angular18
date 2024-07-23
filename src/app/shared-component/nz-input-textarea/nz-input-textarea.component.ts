import { Self, Optional, Component, ElementRef, TemplateRef, viewChild, model, effect, input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  standalone: true,
  selector: 'app-nz-input-textarea',
  imports: [FormsModule, NzFormModule, NzInputModule],
  template: `
    <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
      <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()">
        <textarea #inputControl nz-input
              [required]="required()"
              [disabled]="_disabled"
              [id]="itemId()"
              [placeholder]="placeholder()"
              [ngModel]="_value()"
              [nzAutosize]="nzAutoSize()"
              [rows]="rows()"
              (ngModelChange)="onChange($event)"
              (blur)="onTouched()">
        </textarea>
      </nz-form-control>
    </nz-form-item>
  `
})
export class NzInputTextareaComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent)
  element = viewChild.required<ElementRef<HTMLInputElement>>('inputControl');

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  nzAutoSize = input<boolean | { minRows: number, maxRows: number }>(false);
  rows = input<number>(1);
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

}
