import { Injectable } from '@angular/core';
import { Devspace } from '@shared/interface/devspace';

@Injectable({
  providedIn: 'root'
})
export class DevspaceService {
  channelsName = '';
  channelsDescription = '';
  openDevspace = true;
  openMessage = false;
  openAddMessage = false;
  openChannel = false;
  openThread = false;
  openDirectMessage = false;

  constructor() {}

  channels: Devspace[] = [
    {
      name: 'Entwicklerteam',
      description: 'Dieser Channel ist für alle Entwickler zuständig.',
      channelActiveTalk: false
    }
  ];

  emojis = ['😊', '😂', '❤️', '👍', '🔥'];

  activeUser: DevspaceAccount | null = null;

  setActiveUser(userData: any) {
    this.activeUser = {
      ...userData,
      name: userData.displayName || userData.name,
      email: userData.email || 'Email is not available',
      pic: userData.profile || '/assets/avatar/avatar3.svg',
      active: true,
      activeSelf: true,
      activeMessage: false
    };
  }

  getDisplayName(): string {
    return this.activeUser?.name || '';
  }

  accounts: DevspaceAccount[] = [
    {
      name: 'Florian Beck',
      active: true,
      pic: '/assets/avatar/avatar1.svg',
      activeSelf: true,
      activeMessage: false
    },
    {
      name: 'Sofia Müller',
      active: false,
      pic: '/assets/avatar/avatar2.svg',
      activeSelf: false,
      activeMessage: false
    },
    {
      name: 'Noah Braun',
      active: true,
      pic: '/assets/avatar/avatar3.svg',
      activeSelf: false,
      activeMessage: false
    },
    {
      name: 'Elias Beumann',
      active: false,
      pic: '/assets/avatar/avatar5.svg',
      activeSelf: false,
      activeMessage: false
    },
    {
      name: 'Frederik Beck',
      active: true,
      pic: '/assets/avatar/avatar6.svg',
      activeSelf: false,
      activeMessage: false
    }
  ];
}

export interface DevspaceAccount {
  uid?: string;
  email?: string;
  name: string;
  active: boolean;
  pic: string;
  activeSelf: boolean;
  activeMessage: boolean;
}
