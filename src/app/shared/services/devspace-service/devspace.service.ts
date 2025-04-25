import { Injectable } from '@angular/core';
import { Devspace } from '@shared/interface/devspace';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirestoreService } from '../firestore-service/firestore.service';
import { ChatMessage } from '@shared/interface/chat-message';

@Injectable({
  providedIn: 'root'
})
export class DevspaceService {
  selectedChannelId: string | null = null;
  
  channelMember = false;
  channelMemberAdded = false;
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
  loggedInUserUid: string = '';
  channelArray = new BehaviorSubject<any[]>([]);
  contactArray = new BehaviorSubject<any[]>([]);
  clearInputMessage = false;
  channelNameforThread: string = '';
  threadCount: number = 0;
  creatorMessageOn: { [key: string]: boolean } = {
    channel: false,
    thread: false
  };
  selectedCreatorMessageIndex: { [key: string]: number | null } = {
    channel: null,
    thread: null
  }
  barContext: 'message' | 'channel' | 'thread' | 'directmessage' | null = null;
  private subscription?: Subscription;
  private clearInputMessageSubject = new BehaviorSubject<boolean>(false);
  clearInputMessage$ = this.clearInputMessageSubject.asObservable();

  constructor(public Firestore: FirestoreService) {
    this.subscription = this.Firestore.channels$.subscribe(channels => {
      this.channels = channels;      
    });
  }

  editCreatorMessage(section: "channel" | "thread" | "directmessage", index: number): void {
    this.creatorMessageOn[section] = true;
    this.selectedCreatorMessageIndex[section] = index;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


  setClearInputMessage(status: boolean) {
    this.clearInputMessageSubject.next(status);
  }

  channels: Devspace[] = [];



  emojis = ['✅', '😊', '😂', '❤️', '👍', '🔥', '🎉', '💡', '😎', '🚀', '✨', '🙌', '🎶', '🥳', '💪', '🧐', '🌟', '🤩', '🍀', '🏆', '🤖', '👀', '💯', '🤗', '🤔', '😜', '😇', '😅', '🤝', '🎯', '🦾', '🕶️', '🐱', '🎨', '🏅', '💰', '🛠️', '📚', '📝', '📢', '🎤', '🌍', '🔑', '💌', '🕹️', '🔮', '🎭', '🛸', '👨‍💻', '👩‍💻', '🧠', '⚡', '🛤️', '⏳', '🌀', '💎', '🥇', '📈', '🗝️', '🃏', '🎲', '💥'];
  emojisRections = [
    { emoji: '/assets/img/emojis/icon1.png' },
    { emoji: '/assets/img/emojis/icon2.png' },
    { emoji: '/assets/img/emojis/icon3.png' },
    { emoji: '/assets/img/emojis/icon4.png' },
    { emoji: '/assets/img/emojis/icon5.png' },
    { emoji: '/assets/img/emojis/icon6.png' },
    { emoji: '/assets/img/emojis/icon7.png' },
    { emoji: '/assets/img/emojis/icon8.png' },
    { emoji: '/assets/img/emojis/icon9.png' },
    { emoji: '/assets/img/emojis/icon10.png' },   

  ]
  accounts: DevspaceAccount[] = [];
  closAllMessage() {
    this.openMessage = false;
    this.openChannel = false;
    this.openThread = false;
    this.openDirectMessage = false;
  }

}
