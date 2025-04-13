import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatMessage } from '@shared/interface/chat-message';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { FormatMessageDatePipe } from '@shared/services/TimeFormat/format-message-date.pipe';

@Component({
  selector: 'app-message-area',
  imports: [CommonModule, FormatMessageDatePipe],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.scss'
})
export class MessageAreaComponent {
  @Input() messageSection!: 'channel' | 'thread' | 'directmessage';
  hoveredIndexCreator: number | null = null;
  hoveredIndexMember: number | null = null;
  isHoveredAnswer: boolean = false;
  isHoveredReaction: boolean = false;
  isHoveredEdit: boolean = false;
  messages: ChatMessage[] = [];
  accounts: DevspaceAccount[] = [];
  filterMessageAccounts: DevspaceAccount[] = [];

  constructor(public devspaceService: DevspaceService, public firestore: FirestoreService) {

  }

  ngOnInit(): void {
    switch (this.messageSection) {
      case 'channel':
        console.log("channel ist ausgewählt ");
        this.firestore.subscribeToMessages(this.devspaceService.selectedChannelId!);
        this.firestore.messages$.subscribe(messages => {
          this.messages = messages;
        });
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



  }


  checkMessage(i: number, pic: string) {
    const message = this.messages[i];
    const reactionsExists = message.reactions?.some(r => r.emoji === pic);
    console.log(message, this.devspaceService.selectedChannelId);
    

    if (!reactionsExists) {
      const reactionsText = {
        emoji: pic,
        uids: [message.creator],

      };
      this.firestore.addReactionToMessage(this.devspaceService.selectedChannelId!, message.id!, reactionsText);
    }
  }
}
