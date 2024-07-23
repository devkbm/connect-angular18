import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { TeamGridComponent } from './team-grid.component';
import { TeamFormComponent } from './team-form.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  drawerVisible = false;

  queryKey = 'teamId';
  queryValue = '';

  grid = viewChild.required<TeamGridComponent>('teamGrid');
  form = viewChild.required<TeamFormComponent>('teamForm');

  ngOnInit() {
    this.getTeamList();
  }

  closeDrawer() {
    this.drawerVisible = false;
  }

  openDrawer() {
    this.drawerVisible = true;
  }

  selectedItem(item: any) {
    // this.form.authorityForm.patchValue(item);
  }

  editDrawOpen(item: any) {
    this.form().getTeam(item.teamId);

    this.openDrawer();
  }

  getTeamList() {
    let params: any = new Object();
    if ( this.queryValue !== '') {
      params[this.queryKey] = this.queryValue;
    }

    this.closeDrawer();
    this.grid().getTeamList(params);
  }

  deleteTeam() {
    this.form().deleteTeam(this.form().form.get('teamId')?.value);
  }

  initForm() {
    this.form().newForm();
    this.openDrawer();
  }

}
