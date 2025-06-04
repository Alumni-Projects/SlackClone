import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChatMessage } from '@shared/interface/chat-message';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { FormatMessageDatePipe } from '@shared/services/TimeFormat/format-message-date.pipe';
import { DeleteAreaComponent } from './delete-area/delete-area.component';

@Component({
  selector: 'app-message-area',
  imports: [CommonModule, FormatMessageDatePipe, FormsModule],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.scss'
})
export class MessageAreaComponent {
  @Input() messageSection!: 'channel' | 'thread' | 'directmessage';
  @ViewChild('editMessage') editMessages!: ElementRef<HTMLDivElement>;
  hoveredIndexCreator: number | null = null;
  hoveredIndexMember: number | null = null;
  editIndex: number | null = null;
  activeEmojiBarIndex: number | null = null;
  activeEmojiBarIndexEdit: number | null = null;
  editMessageBarIndex: number | null = null;
  isHoveredAnswer = false;
  isHoveredReaction = false;
  isHoveredEdit = false;
  isHoveredEditSmile = false;
  editEmoji = false;
  editMessageBar = false;
  isHoveredReactionMessage: number | null = null;
  isHoveredReactionMessageMember: number | null = null;
  emojibar = false;
  messages: ChatMessage[] = [];
  threadMessages: ChatMessage[] = [];
  directMessages: ChatMessage[] = [];
  accounts: DevspaceAccount[] = [];
  filterMessageAccounts: DevspaceAccount[] = [];



  constructor(public devspaceService: DevspaceService, public firestore: FirestoreService, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {

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
          console.warn("Thread oder Channel ID failed.");
        }
        break;

      case 'directmessage':
        this.firestore.directMessages$.subscribe((messages: ChatMessage[]) => {
          this.directMessages = messages;
        });
        break;

      default:
        console.log("no message section");
        break;
    }
  }

  get activeMessages(): ChatMessage[] {
    switch (this.messageSection) {
      case 'channel': return this.messages;
      case 'thread': return this.threadMessages;
      case 'directmessage': return this.directMessages;
      default: return [];
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
    } else if (this.messageSection === 'directmessage') {
      const message = this.directMessages[i];

      const reactionsExists = message.reactions?.some(r => r.emoji === pic);
      const dmId = this.devspaceService.contactDmId;
      if (!reactionsExists) {
        const reactionsText = {
          emoji: pic,
          uids: [this.devspaceService.loggedInUserUid],
          creator: this.devspaceService.loggedInUserUid,
          createdAt: new Date().toISOString(),
        };
        this.firestore.addReactionToDm(dmId!, message.id!, reactionsText);
      }

    }
    this.emojibar = false;
    this.activeEmojiBarIndex = null;
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
    } else if (this.messageSection === 'directmessage') {
      const message = this.directMessages[i];
      const dmId = this.devspaceService.contactDmId;
      this.firestore.changeReactionToDM(i, j, message, userId, dmId!);
    }
  }

  editMessageCreator(i: number) {
    this.isHoveredEdit = false;
    const editMessage = this.editMessages.nativeElement.innerText.trim();
    const userId = this.devspaceService.loggedInUserUid;
    const channelId = this.devspaceService.selectedChannelId!;
    const dmId = this.devspaceService.contactDmId ?? undefined;

    if (this.messageSection === 'channel') {
      const message = this.messages[i];    
       this.saveMessage({
      i,
      message,
      userId,
      channelId,
      editMessage,      
    });

    } else if (this.messageSection === 'thread') {
      const threadMessage = this.threadMessages[i];
      const parentMessageId = threadMessage.parentId!;
      const threadId = threadMessage.id!;
      this.saveMessage({
        i,
        message: threadMessage,
        userId,
        channelId,
        parentMessageId,
        threadId,
        editMessage
      });

    } else if (this.messageSection === 'directmessage') {
      const message = this.directMessages[i];
      this.saveMessage({
        i,
        message,
        userId,
        channelId,
        editMessage,
        dmId
      });
    }
  }

  async saveMessage({
  i,
  message,
  userId,
  channelId,
  parentMessageId,
  threadId,
  editMessage,
  dmId
}: {
  i: number;
  message: ChatMessage;
  userId: string;
  channelId: string;
  parentMessageId?: string;
  threadId?: string;
  editMessage?: string;
  dmId?: string;
}): Promise<void> {
  try {
    await this.firestore.editMessage({
      index: i,
      message,
      userId,
      channelId,
      parentMessageId,
      threadId,
      editMessage,
      dmId        
    });      
    this.devspaceService.editCreatorMessage(this.messageSection, -1);
    this.editMessageBarIndex = null;
    this.editMessageBar = false;
  } catch (error) {
    console.error('error with saving message:', error);
  }
}



openEmojibar(i: number) {
  this.emojibar = !this.emojibar;
  this.activeEmojiBarIndex = this.activeEmojiBarIndex === i ? null : i;
  this.editMessageBarIndex = null;
  this.editMessageBar = false;
}

openEditMessageBar(i: number) {
  this.editMessageBar = !this.editMessageBar;
  this.editMessageBarIndex = this.editMessageBarIndex === i ? null : i;
  this.emojibar = false;
  this.activeEmojiBarIndex = null;
}

openEditMessageEmoji(i: number) {
  this.editEmoji = !this.editEmoji;
  this.activeEmojiBarIndexEdit = this.activeEmojiBarIndexEdit === i ? null : i;
}


onLeaveMessageArea(type: 'member' | 'creator',) {
  if (type === 'member') {
    this.hoveredIndexMember = null;

  } else {
    this.hoveredIndexCreator = null;

  }
  this.editMessageBarIndex = null;
  this.editMessageBar = false;
  this.activeEmojiBarIndex = null;
  this.emojibar = false;

}

leaveEditArea() {
  this.isHoveredEdit = false;
  this.devspaceService.editCreatorMessage(this.messageSection, -1);
  this.hoveredIndexCreator = null;
  this.editEmoji = false;
  this.activeEmojiBarIndexEdit = null;
  this.editMessageBarIndex = null;
  this.editMessageBar = false;

}

openThread(i: number) {
  this.devspaceService.openThread = false;
  setTimeout(() => {
    const threadMessage = this.messages[i];
    this.firestore.selectedThreadMessage = threadMessage;
    this.devspaceService.openThread = true;
  }, 100);

}

editMessageOpen(i: number) {
  this.devspaceService.editCreatorMessage(this.messageSection, i);
  this.isHoveredAnswer = false;
}

cancelEditMessage() {
  this.isHoveredEdit = false;
  this.devspaceService.editCreatorMessage(this.messageSection, -1);
  this.editMessageBarIndex = null;
  this.editMessageBar = false;
}

DeleteDialog({
  i,
  message,
  userId,
  channelId,
  parentMessageId,
  threadId,  
  dmId
}: {
  i: number;
  message: ChatMessage;
  userId: string;
  channelId: string;
  parentMessageId?: string;
  threadId?: string;  
  dmId?: string;
}): void {
  this.dialog.open(DeleteAreaComponent, {
    data: {
      i,
      message,
      userId,
      channelId,
      parentMessageId,
      threadId,      
      dmId,
      section: this.messageSection
    }
  });
}


deleteMessage(i: number) {
    this.isHoveredEdit = false;    
    const userId = this.devspaceService.loggedInUserUid;
    const channelId = this.devspaceService.selectedChannelId!;
    const dmId = this.devspaceService.contactDmId ?? undefined;

    if (this.messageSection === 'channel') {
      const message = this.messages[i];    
       this.DeleteDialog({
      i,
      message,
      userId,
      channelId,           
    });

    } else if (this.messageSection === 'thread') {
      const threadMessage = this.threadMessages[i];
      const parentMessageId = threadMessage.parentId!;
      const threadId = threadMessage.id!;
      this.DeleteDialog({
        i,
        message: threadMessage,
        userId,
        channelId,
        parentMessageId,
        threadId,       
      });

    } else if (this.messageSection === 'directmessage') {
      const message = this.directMessages[i];
      this.DeleteDialog({
        i,
        message,
        userId,
        channelId,        
        dmId
      });
    }
  }


editcheckMessage(i: number) {
  const emoji = this.devspaceService.emojis[i];
  const messageDiv = this.editMessages.nativeElement as HTMLDivElement;
  messageDiv.focus();
  const selection = window.getSelection();
  const range = document.createRange();
  if (!messageDiv.textContent?.trim()) {
    messageDiv.innerHTML = "";
  }
  range.selectNodeContents(messageDiv);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
  const textNode = document.createTextNode(emoji);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
  this.cdRef.detectChanges();
  this.editEmoji = false;
  this.activeEmojiBarIndexEdit = null;
}

closeSmileyBar() {
  this.editEmoji = false;
  this.activeEmojiBarIndexEdit = null;
}

showDate(i: number): boolean {
  if (i === 0) return true;

  const current = this.activeMessages[i];
  const previous = this.activeMessages[i - 1];

  const currentDate = new Date(current.createdAt).toDateString();
  const previousDate = new Date(previous.createdAt).toDateString();

  return currentDate !== previousDate;

}
}

