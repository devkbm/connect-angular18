import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { NzInputDeptSelectModel } from './nz-input-dept-select.model';

@Injectable({
  providedIn: 'root'
})
export class NzInputDeptSelectService extends DataService {

  constructor() {
    super('/api/system/dept');
  }

  getDeptList(params?: any): Observable<ResponseList<NzInputDeptSelectModel>> {
    const url = `${this.API_URL}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<NzInputDeptSelectModel>>(url, options).pipe(
      catchError(this.handleError<ResponseList<NzInputDeptSelectModel>>('getDeptList', undefined))
    );
  }

}
