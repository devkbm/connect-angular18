import { Location } from '@angular/common';
import { inject } from '@angular/core';

export class AppBase {

  protected appId: string = '';
  protected _location = inject(Location);

  goBack() {
    this._location.back();
  }

  goFoward() {
    this._location.forward();
  }

}
