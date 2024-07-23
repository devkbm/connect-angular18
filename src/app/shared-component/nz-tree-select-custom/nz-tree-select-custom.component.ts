import { ChangeDetectionStrategy, Component, forwardRef, Input, TemplateRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  standalone: true,
  selector: 'app-nz-tree-select-custom',
  imports: [FormsModule, NzFormModule, NzTreeSelectModule],
  template: `
    <nz-form-item>
      <nz-form-label [nzFor]="itemId" [nzRequired]="required">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control [nzErrorTip]="nzErrorTip">
       <nz-tree-select
            [nzId]="itemId"
            [(ngModel)]="value"
            [nzNodes]="nodes"
            [nzDisabled]="disabled"
            [nzPlaceHolder]="placeholder"
            (blur)="onTouched()"
            (ngModelChange)="onChange($event)">
        </nz-tree-select>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => NzTreeSelectCustomComponent
      ),
      multi: true
    }
  ]
})
export class NzTreeSelectCustomComponent implements ControlValueAccessor {

  @Input() itemId: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() nodes!: any[];

  @Input() nzErrorTip?: string | TemplateRef<{$implicit: AbstractControl | NgModel;}>;

  value!: string;

  onChange!: (value: string) => void;
  onTouched!: () => void;

  writeValue(obj: any): void {
    this.value = obj;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

}
