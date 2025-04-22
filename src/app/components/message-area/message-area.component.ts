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
  activeEmojiBarIndex: number | null = null;
  isHoveredAnswer = false;
  isHoveredReaction = false;
  isHoveredEdit = false;
  isHoveredReactionMessage: number | null = null;
  isHoveredReactionMessageMember: number | null = null;
  emojibar = false;
  messages: ChatMessage[] = [];
  threadMessages: ChatMessage[] = [];
  accounts: DevspaceAccount[] = [];
  filterMessageAccounts: DevspaceAccount[] = [];

  constructor(public devspaceService: DevspaceService, public firestore: FirestoreService) {

  }

  get activeMessages(): ChatMessage[] {
    switch (this.messageSection) {
      case 'channel': return this.messages;
      case 'thread': return this.threadMessages;
      // case 'directmessage': return this.directMessages; 
      default: return [];
    }
  }

  ngOnInit(): void {
    switch (this.messageSection) {
      case 'channel':        
        this.firestore.subscribeToMessages(this.devspaceService.selectedChannelId!);
        this.firestore.messages$.subscribe(messages => {
          this.messages = messages;          
        });
        break;
      case 'thread':        
        const channelId = this.devspaceService.selectedChannelId;
        const selectedThread = this.firestore.selectedThreadMessage;
        if (channelId && selectedThread?.id) {
          this.firestore.subscribeToThreadMessages(channelId, selectedThread.id);
          this.firestore.threadMessages$.subscribe(messages => {
            this.threadMessages = messages;            
          });
        } else {
          console.warn("Thread oder Channel ID fehlt.");
        }
        break;

      case 'directmessage':
        console.log("directmessage ist ausgewählt ");
        break;

      default:
        console.log("keine MessageSection ausgewählt");
        break;
    }
  }



  checkMessage(i: number, pic: string) {

    if (this.messageSection === 'channel') {
      const message = this.messages[i];
      const reactionsExists = message.reactions?.some(r => r.emoji === pic);
      if (!reactionsExists) {
        const reactionsText = {
          emoji: pic,
          uids: [this.devspaceService.loggedInUserUid],
          creator: this.devspaceService.loggedInUserUid,
          createdAt: new Date().toISOString(),

        };
        this.firestore.addReactionToMessage(this.devspaceService.selectedChannelId!, message.id!, reactionsText);
      }
    } else if (this.messageSection === 'thread') {
      const threadId = this.threadMessages[i];
      const parentmessageid = threadId.parentId;
      const threadid = threadId.id;
      const reactionsExists = threadId.reactions?.some(r => r.emoji === pic);
      if (!reactionsExists) {
        const reactionsText = {
          emoji: pic,
          uids: [this.devspaceService.loggedInUserUid],
          creator: this.devspaceService.loggedInUserUid,
          createdAt: new Date().toISOString(),

        };
        this.firestore.addReactionToMessage(
          this.devspaceService.selectedChannelId!,
          threadid!,
          reactionsText,
          parentmessageid!,
          threadid!
        );
      }
    }
  }
  logHoverIn(i: number, member: string): void {
    if (member == 'member') {
      this.isHoveredReactionMessageMember = i;
    } else {
      this.isHoveredReactionMessage = i;
    }
  }

  logHoverOut(member: string): void {
    if (member == 'member') {
      this.isHoveredReactionMessageMember = null;
    } else {
      this.isHoveredReactionMessage = null;
    }
  }

  changeReaction(i: number, j: number) {
    const userId = this.devspaceService.loggedInUserUid;
    const channelId = this.devspaceService.selectedChannelId!;

    if (this.messageSection === 'channel') {
      const message = this.messages[i];
      this.firestore.changeReactionToMessage(i, j, message, userId, channelId);
    } else if (this.messageSection === 'thread') {
      const threadMessage = this.threadMessages[i];
      const parentMessageId = threadMessage.parentId!;
      const threadId = threadMessage.id!;
      this.firestore.changeReactionToMessage(i, j, threadMessage, userId, channelId, parentMessageId, threadId);
    }
  }

  obenEmojibar(i: number) {
    this.emojibar = !this.emojibar;
    this.activeEmojiBarIndex = this.activeEmojiBarIndex === i ? null : i;
  }
  onLeaveMessageArea(type: 'member' | 'creator',) {
    if (type === 'member') {
      this.hoveredIndexMember = null;
    } else {
      this.hoveredIndexCreator = null;
    }
    this.activeEmojiBarIndex = null;
    this.emojibar = false;

  }

  openThread(i: number) {
    this.devspaceService.openThread = false;
    setTimeout(() => {
      const threadMessage = this.messages[i];
      this.firestore.selectedThreadMessage = threadMessage;
      this.devspaceService.openThread = true;
    }, 100);

  }
}
