import { Self, Optional, Component, TemplateRef, viewChild, input, model, effect } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'app-nz-input-dept-tree-select',
  standalone: true,
  imports: [FormsModule, NzFormModule, NzTreeSelectModule],
  template: `
   <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()">
       <nz-tree-select
            [nzId]="itemId()"
            [ngModel]="_value()"
            [nzNodes]="nodes()"
            [nzDisabled]="_disabled"
            [nzPlaceHolder]="placeholder()"
            (blur)="onTouched()"
            (ngModelChange)="onChange($event)">
        </nz-tree-select>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: []
})
export class NzInputDeptTreeSelectComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent);

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  nodes = input.required<NzTreeNodeOptions[] | NzTreeNode[]>();

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
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

}
