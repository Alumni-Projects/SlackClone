import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatMessage } from '@shared/interface/chat-message';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-message-area',
  imports: [CommonModule],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.scss'
})
export class MessageAreaComponent {
  @Input() messageSection!: 'channel' | 'thread' | 'directmessage';
  

  messages: ChatMessage[] = [];
  accounts: DevspaceAccount[] = [];
  filterMessageAccounts: DevspaceAccount[] = [];

  constructor(public devspaceService: DevspaceService, public firestore: FirestoreService) {

  }

  ngOnInit(): void {
    switch (this.messageSection) {
      case 'channel':
        console.log("channel ist ausgewählt ");



        break;
      case 'thread':
        console.log("thread ist ausgewählt ");


        break;
      case 'directmessage':
        console.log("directmessage ist ausgewählt ");
        break;
      default:
        console.log("keine MessageSection ausgewählt");

        break;
    }

    this.firestore.subscribeToMessages(this.devspaceService.selectedChannelId!);
    this.firestore.messages$.subscribe(messages => {
      this.messages = messages;      
    });

  }

 
  filteraccounts() {

  }

}
