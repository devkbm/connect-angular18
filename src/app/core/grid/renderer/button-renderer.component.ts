import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button-renderer',
  standalone: true,
  imports: [ NzButtonModule, NzIconModule ],
  template: `
    <button nz-button nzSize="small" nzBlock="true" (click)="onClick($event)" class="button">
      <span nz-icon [nzType]="iconType" class="icon"></span>
      {{label}}
    </button>
  `,
  styles: [`
    .button {
      height: 24px;
    }
    .icon {
      font-size: 16px; color: #08c;
    }
  `]
})
export class ButtonRendererComponent implements ICellRendererAngularComp {

  params: any;
  label: string = '';
  iconType: string= '';

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.label = this.params.label || null;
    this.iconType = this.params.iconType || null;
  }

  refresh(params: any): boolean {
    return true;
  }

  onClick($event: any): void {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      };

      this.params.onClick(params);
    }
  }


}
