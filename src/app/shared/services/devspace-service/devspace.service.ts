import { Injectable } from '@angular/core';
import { Devspace } from '@shared/interface/devspace';
import { DevspaceAccount } from '@shared/interface/devspace-account';

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
      description: 'Dieser Channel ist für alle Entwickler zuständig..',
      channelActiveTalk: false
    }
  ];

  emojis = ['😊', '😂', '❤️', '👍', '🔥'];

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
