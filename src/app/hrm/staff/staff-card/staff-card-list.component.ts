import { CommonModule } from '@angular/common';
import { StaffCardComponent } from './staff-card.component';

import { Component, OnInit, inject } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';
import { StaffCardModel } from './staff-card.model';
import { StaffCardService } from './staff-card.service';

@Component({
  selector: 'app-staff-card-list',
  standalone: true,
  imports: [
    CommonModule, StaffCardComponent
  ],
  template: `
    @for (item of _list; track item.staffId) {
      <app-staff-card [data]="item"></app-staff-card>
    }
  `,
  styles: []
})
export class StaffCardListComponent implements OnInit {
  _list: StaffCardModel[] = [];

  private service = inject(StaffCardService);

  ngOnInit() {
    this.getStaffCardList();
  }

  getStaffCardList() {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<StaffCardModel>) => {
            if (model.total > 0) {
              this._list = model.data;
            } else {
              this._list = [];
            }
          }
        );
  }
}
