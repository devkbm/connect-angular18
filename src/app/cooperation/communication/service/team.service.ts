import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from '../../../core/service/data.service';
import { ResponseObject } from '../../../core/model/response-object';
import { ResponseList } from '../../../core/model/response-list';
import { Team } from '../model/team';
import { TeamMember } from '../model/team-member';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends DataService {

  constructor() {
      super('/grw');
  }

  /**
   * @description 팀명단을 조회한다.
   * @param params 조회 조건 객체
   */
  public getTeamList(params?: any): Observable<ResponseList<Team>> {
    const url = `${this.API_URL}/team`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      params: params
    };

    return this.http
      .get<ResponseList<Team>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<Team>>('getTeamList', undefined))
      );
  }

  /**
   * @description 팀명단을 조회한다.
   * @param id 팀 id
   */
  public getTeam(id: number): Observable<ResponseObject<Team>> {
    const url = `${this.API_URL}/team/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders()
    };

    return this.http
      .get<ResponseObject<Team>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<Team>>('getTeam', undefined))
      );
  }

  /**
   * @description 팀을 저장한다.
   * @param team team 객체
   */
  public saveTeam(team: Team): Observable<ResponseObject<Team>> {
    const url = `${this.API_URL}/team`;
    const options = {
      headers: this.getAuthorizedHttpHeaders()
    };

    return this.http
    .post<ResponseObject<Team>>(url, team, options)
    .pipe(
      catchError(this.handleError<ResponseObject<Team>>('saveTeam', undefined))
    );

  }

  /**
   * @description 팀을 삭제한다.
   * @param id team 객체 id
   */
  public deleteTeam(id: number): Observable<ResponseObject<Team>> {
    const url = `${this.API_URL}/team/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders()
    };

    return this.http
      .delete<ResponseObject<Team>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<Team>>('deleteTeam', undefined))
      );
  }

  public getAllMemberList(params?: any): Observable<ResponseList<TeamMember>> {
    const url = `${this.API_URL}/allmember`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      params: params
    };

    return this.http
      .get<ResponseList<TeamMember>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<TeamMember>>('getAllMemberList', undefined))
      );
  }

}
