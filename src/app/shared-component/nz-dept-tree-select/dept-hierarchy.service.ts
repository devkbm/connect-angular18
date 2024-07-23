import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { DeptHierarchy } from './dept-hierarchy.model';
import { GlobalProperty } from 'src/app/core/global-property';

@Injectable({
  providedIn: 'root'
})
export class DeptHierarchyService extends DataService {

  constructor() {
    super('/api/system/dept');
  }

  getDeptHierarchyList(params?: any): Observable<ResponseList<DeptHierarchy>> {
    const url = GlobalProperty.serverUrl + '/api/system/depttree';
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<DeptHierarchy>>(url, options).pipe(
      catchError(this.handleError<ResponseList<DeptHierarchy>>('getDeptHierarchyList', undefined))
    );
  }

}
