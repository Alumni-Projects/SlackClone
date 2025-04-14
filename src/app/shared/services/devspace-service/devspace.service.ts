import { Injectable } from '@angular/core';
import { Devspace } from '@shared/interface/devspace';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirestoreService } from '../firestore-service/firestore.service';

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
  currentUserUid: string | null = null;
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
  barContext: 'message' | 'channel' | 'thread' | 'directmessage' | null = null;
  private subscription?: Subscription;
  private clearInputMessageSubject = new BehaviorSubject<boolean>(false);
  clearInputMessage$ = this.clearInputMessageSubject.asObservable();

  constructor(public Firestore: FirestoreService) {
    this.subscription = this.Firestore.channels$.subscribe((channels) => {
      this.channels = channels;
      console.log('Updated channels:', this.channels);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  setClearInputMessage(status: boolean) {
    this.clearInputMessageSubject.next(status);
  }

  channels: Devspace[] = [];

  emojis = [
    '😊',
    '😂',
    '❤️',
    '👍',
    '🔥',
    '🎉',
    '💡',
    '😎',
    '🚀',
    '✨',
    '🙌',
    '🎶',
    '🥳',
    '💪',
    '🧐',
    '🌟',
    '🤩',
    '🍀',
    '🏆',
    '🤖',
    '👀',
    '💯',
    '🤗',
    '🤔',
    '😜',
    '😇',
    '😅',
    '🤝',
    '🎯',
    '🦾',
    '🕶️',
    '🐱',
    '🎨',
    '🏅',
    '💰',
    '🛠️',
    '📚',
    '📝',
    '📢',
    '🎤',
    '🌍',
    '🔑',
    '💌',
    '🕹️',
    '🔮',
    '🎭',
    '🛸',
    '👨‍💻',
    '👩‍💻',
    '🧠',
    '⚡',
    '🛤️',
    '⏳',
    '🌀',
    '💎',
    '🥇',
    '📈',
    '🗝️',
    '🃏',
    '🎲',
    '💥'
  ];

  accounts: DevspaceAccount[] = [];
  closAllMessage() {
    this.openMessage = false;
    this.openChannel = false;
    this.openThread = false;
    this.openDirectMessage = false;
  }

  activeUser: DevspaceAccount | null = null;

  setActiveUser(userData: any) {
    this.activeUser = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      emailVerified: userData.emailVerified,
      profile: userData.profile,
      createdAt: userData.createdAt,
      online: userData.online,
      name: userData.name || '',
      active: userData.active || false,
      pic: userData.pic || '',
      activeSelf: userData.activeSelf || false,
      activeMessage: userData.activeMessage || false,
      role: userData.role || 'user'
    };
  }
}

export interface DevspaceAccount {
  uid: string;
  email: string;
  name: string;
  displayName: string;
  active: boolean;
  pic: string;
  activeMessage: boolean;
  activeSelf: boolean;
  role: string;
  emailVerified: boolean;
  profile: string;
  createdAt: string;
  online: boolean;
}
