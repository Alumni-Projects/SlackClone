import { Injectable } from '@angular/core';
import { Devspace } from '@shared/interface/devspace';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from '../firestore-service/firestore.service';

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
  channelNameInput: string = '';
  openSmileyBar = false;
  openContactBar = false;
  openChannelBar = false;
  openContactBarSearch = false;
  openChannelBarSearch = false;
  channelArray = new BehaviorSubject<any[]>([]);
  contactArray = new BehaviorSubject<any[]>([]);
  clearInputMessage = false;
  barContext: 'message' | 'channel' | 'thread' | 'directmessage' | null = null;
  constructor(public Firestore: FirestoreService) { }


  private clearInputMessageSubject = new BehaviorSubject<boolean>(false);
  clearInputMessage$ = this.clearInputMessageSubject.asObservable();


  setClearInputMessage(status: boolean) {
    this.clearInputMessageSubject.next(status);
  }

  channels: Devspace[] = [
    {
      name: 'Entwicklerteam',

      description: 'Dieser Channel ist für alle Entwickler zuständig..qdqwqq qwdqw qwdqdw qdq dqwd qwdq dwqd qwdq dq wdq dwq dqd qdwq dwq dq wqd qwdq dwqdq qd qdq dwq dwq dwqd qwd q',
      channelActiveTalk: false, 
      contact: [
        { name: 'Florian Beck', active: true, pic: '/assets/img/Avatar1.png', activeSelf: true, activeMessage: false },
        { name: 'Sofia Müller', active: false, pic: '/assets/img/Avatar2.png', activeSelf: false, activeMessage: false },
        { name: 'Noah Braun', active: true, pic: '/assets/img/Avatar3.png', activeSelf: false, activeMessage: false },
        { name: 'Elias Beumann', active: false, pic: '/assets/img/Avatar5.png', activeSelf: false, activeMessage: false },
        { name: 'Frederik Beck', active: true, pic: '/assets/img/Avatar6.png', activeSelf: false, activeMessage: false }],
        channelCreated: [
          { name: 'Florian Beck', active: true, pic: '/assets/img/Avatar1.png', activeSelf: true, activeMessage: false },
        ]
    },
  ];



  emojis = ['😊', '😂', '❤️', '👍', '🔥', '🎉', '💡', '😎', '🚀', '✨', '🙌', '🎶', '🥳', '💪', '🧐', '🌟', '🤩', '🍀', '🏆', '🤖', '👀', '💯', '🤗', '🤔', '😜', '😇', '😅', '🤝', '🎯', '🦾', '🕶️', '🐱', '🎨', '🏅', '💰', '🛠️', '📚', '📝', '📢', '🎤', '🌍', '🔑', '💌', '🕹️', '🔮', '🎭', '🛸', '👨‍💻', '👩‍💻', '🧠', '⚡', '🛤️', '⏳', '🌀', '💎', '🥇', '📈', '🗝️', '🃏', '🎲', '💥'];

  accounts: DevspaceAccount[] = [
    // { name: 'Florian Beck', active: true, pic: '/assets/img/Avatar1.png', activeSelf: true, activeMessage: false, },
    // { name: 'Sofia Müller', active: false, pic: '/assets/img/Avatar2.png', activeSelf: false, activeMessage: false },
    // { name: 'Noah Braun', active: true, pic: '/assets/img/Avatar3.png', activeSelf: false, activeMessage: false },
    // { name: 'Elias Beumann', active: false, pic: '/assets/img/Avatar5.png', activeSelf: false, activeMessage: false },
    // { name: 'Frederik Beck', active: true, pic: '/assets/img/Avatar6.png', activeSelf: false, activeMessage: false },



  ];
  closAllMessage() {
    this.openMessage = false;
    this.openChannel = false;
    this.openThread = false;
    this.openDirectMessage = false;
  }

}
