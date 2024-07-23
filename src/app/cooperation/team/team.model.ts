export interface TeamModel {
  teamId: string | null;
  teamName: string | null;
  memberList: string[] | null;
}

export interface TeamJoinableUserModel {
  userId: string;
  userName: string;
}
