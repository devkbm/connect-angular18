import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-nz-grid-row',
  standalone: true,
  imports: [
    CommonModule, NzGridModule, NzFormModule,
    FormsModule, ReactiveFormsModule
  ],
  template: `
    <div nz-row>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background-color: brown;
    }
  `,
  encapsulation: ViewEncapsulation.Emulated
})
export class NzGridRowComponent {
  // 제대로 동작하지 않음
}
