import { Component, OnInit, inject, output } from '@angular/core';
import { AggridFunction } from 'src/app/core/grid/aggrid-function';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { TeamService } from '../service/team.service';
import { Team } from '../model/team';

@Component({
  selector: 'app-team-grid',
  templateUrl: './team-grid.component.html',
  styleUrls: ['./team-grid.component.css']
})
export class TeamGridComponent extends AggridFunction implements OnInit {

  teamList: Team[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private teamService = inject(TeamService);

  ngOnInit() {
    this.columnDefs = [
      {
          headerName: 'No',
          valueGetter: 'node.rowIndex + 1',
          width: 70,
          cellStyle: {'text-align': 'center'},
          suppressSizeToFit: true
      },
      {
          headerName: '팀 Id',
          field: 'teamId'
      },
      {
        headerName: '팀명',
        field: 'teamName'
      }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true
    };


    this.getRowId = function(data: any) {
        return data.teamId;
    };

    this.sizeToFit();
  }

  public getTeamList(param: any): void {
    this.teamService
        .getTeamList(param)
        .subscribe(
          (model: ResponseList<Team>) => {
              if (model.total > 0) {
                  this.teamList = model.data;
              } else {
                  this.teamList = [];
              }
              this.appAlarmService.changeMessage(model.message);
          },
          (err) => {
              console.log(err);
          },
          () => {}
        );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

}
