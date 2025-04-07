export interface DevspaceAccount {
  name: string;
  active: boolean;
  pic: string;
  email?: string;
  activeSelf: boolean;
  activeMessage: boolean;
  channel?: string[];
}
