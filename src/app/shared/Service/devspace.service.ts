import { Injectable } from '@angular/core';
import { Devspace } from '../../shared/interface/devspace';
import { DevspaceAccount } from '../../shared/interface/devspace-account';

@Injectable({
  providedIn: 'root'
})
export class DevspaceService {
  channelsName = "";
  channelsDescription = "";
  openDevspace = true;
  openMessage = false;
  openAddMessage = false;
  openChannel = false;
  openThread = true;
  openDirectMessage = false;
  constructor() { }

  channels: Devspace[] = [
    {
      name: 'Entwicklerteam', description: 'Dieser Channel ist für alle Entwickler zuständig..',
      channelActiveTalk: false, 
    },
  ];
  
  emojis = ['😊', '😂', '❤️', '👍', '🔥'];
  
  accounts: DevspaceAccount[] = [
    { name: 'Florian Beck', active: true, pic: '/assets/img/Avatar1.png', activeSelf: true, activeMessage: false, },
    { name: 'Sofia Müller', active: false, pic: '/assets/img/Avatar2.png', activeSelf: false, activeMessage: false },
    { name: 'Noah Braun', active: true, pic: '/assets/img/Avatar3.png', activeSelf: false, activeMessage: false },
    { name: 'Elias Beumann', active: false, pic: '/assets/img/Avatar5.png', activeSelf: false, activeMessage: false },
    { name: 'Frederik Beck', active: true, pic: '/assets/img/Avatar6.png', activeSelf: false, activeMessage: false },

  ];
}
