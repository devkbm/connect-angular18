import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, TemplateRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModeType, NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  standalone: true,
  selector: 'app-nz-select-custom',
  imports: [CommonModule, FormsModule, NzFormModule, NzSelectModule],
  templateUrl: './nz-select-custom.component.html',
  styleUrls: ['./nz-select-custom.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => NzSelectCustomComponent
      ),
      multi: true
    }
  ]
})
export class NzSelectCustomComponent implements ControlValueAccessor {

  @Input() itemId: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() options!: any[];
  @Input() opt_label: string = 'label';
  @Input() opt_value: string = 'value';
  @Input() mode: NzSelectModeType = 'default';

  @Input() nzErrorTip?: string | TemplateRef<{$implicit: AbstractControl | NgModel;}>;

  onChange!: (value: string) => void;
  onTouched!: () => void;

  value!: string;

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
