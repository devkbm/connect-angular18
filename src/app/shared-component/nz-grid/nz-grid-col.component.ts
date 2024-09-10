import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-nz-grid-col',
  standalone: true,
  imports: [
    CommonModule, NzGridModule, NzFormModule
  ],
  template: `
    <div nz-col nzSpan="24">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background-color: green;
    }
  `,
  encapsulation: ViewEncapsulation.Emulated
})
export class NzGridColComponent {
    // 제대로 동작하지 않음
}
