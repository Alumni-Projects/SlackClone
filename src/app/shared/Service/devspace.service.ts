import { Injectable } from '@angular/core';
import { Devspace } from '../../shared/interface/devspace';
import { DevspaceAccount } from '../../shared/interface/devspace-account';

@Injectable({
  providedIn: 'root'
})
export class DevspaceService {
  channelsName = "";
  channelsDescription = "";
  openDevspace: boolean = true;
  openMessage: boolean = false;



  constructor() { }

  channels: Devspace[] = [
    {
      name: 'Entwicklerteam', description: 'Dieser Channel ist für alle Entwickler zuständig..',
      channelActiveTalk: false
    },
  ];

  accounts: DevspaceAccount[] = [
    { name: 'Frederik Beck', active: true, pic: './img/Avatar1.png', activeSelf: true, activeMessage: false },
    { name: 'Sofia Müller', active: false, pic: './img/Avatar2.png', activeSelf: false, activeMessage: false },
    { name: 'Noah Braun', active: true, pic: './img/Avatar3.png', activeSelf: false, activeMessage: false },
    { name: 'Elias Beumann', active: false, pic: './img/Avatar5.png', activeSelf: false, activeMessage: false },
    { name: 'Frederik Beck', active: true, pic: './img/Avatar6.png', activeSelf: false, activeMessage: false },

  ];
}
