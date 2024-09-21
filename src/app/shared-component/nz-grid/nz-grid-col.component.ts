import { Component, input, ViewEncapsulation } from '@angular/core';
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
    <div nz-col [nzSpan]="nzSpan()">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      //display: block;
      //background-color: green;
    }
  `,
  encapsulation: ViewEncapsulation.Emulated
})
export class NzGridColComponent {
  nzSpan = input.required<string | number | null>();
}
