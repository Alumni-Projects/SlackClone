import { Injectable } from '@angular/core';
import { Devspace } from '@shared/interface/devspace';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirestoreService } from '../firestore-service/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class DevspaceService {
  selectedChannelId: string | null = null;
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
  private subscription?: Subscription;
  constructor(public Firestore: FirestoreService) { 
    this.subscription = this.Firestore.channels$.subscribe(channels => {
      this.channels = channels;
      console.log('Aktualisierte Channels:', this.channels);
    });  
  }


  private clearInputMessageSubject = new BehaviorSubject<boolean>(false);
  clearInputMessage$ = this.clearInputMessageSubject.asObservable();
  

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // Vermeidet Memory-Leaks
  }


  setClearInputMessage(status: boolean) {
    this.clearInputMessageSubject.next(status);
  }

  channels: Devspace[] = [];



  emojis = ['😊', '😂', '❤️', '👍', '🔥', '🎉', '💡', '😎', '🚀', '✨', '🙌', '🎶', '🥳', '💪', '🧐', '🌟', '🤩', '🍀', '🏆', '🤖', '👀', '💯', '🤗', '🤔', '😜', '😇', '😅', '🤝', '🎯', '🦾', '🕶️', '🐱', '🎨', '🏅', '💰', '🛠️', '📚', '📝', '📢', '🎤', '🌍', '🔑', '💌', '🕹️', '🔮', '🎭', '🛸', '👨‍💻', '👩‍💻', '🧠', '⚡', '🛤️', '⏳', '🌀', '💎', '🥇', '📈', '🗝️', '🃏', '🎲', '💥'];

  accounts: DevspaceAccount[] = [];
  closAllMessage() {
    this.openMessage = false;
    this.openChannel = false;
    this.openThread = false;
    this.openDirectMessage = false;
  }

}
