
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatMessage } from '@shared/interface/chat-message';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { DeleteAreaComponent } from './delete-area/delete-area.component';

@Component({
  selector: 'app-edit-message',
  imports: [],
  templateUrl: './edit-message.component.html',
  styleUrl: './edit-message.component.scss'
})
export class EditMessageComponent {


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      i: number;
      message: ChatMessage;
      userId: string;
      channelId: string;
      parentMessageId?: string;
      threadId?: string;
      editMessage?: string;
      dmId?: string;
      section: 'channel' | 'thread';
    },
    private dialog: MatDialog,
    private firestore: FirestoreService,
    private devspaceService: DevspaceService
  ) {


  }

  closeDialog() {
    this.dialog.closeAll();
  }

  async saveMessage() {
    try {
      await this.firestore.editMessage({
        index: this.data.i,
        message: this.data.message,
        userId: this.data.userId,
        channelId: this.data.channelId,
        parentMessageId: this.data.parentMessageId,
        threadId: this.data.threadId,
        editMessage: this.data.editMessage,
        dmId: this.data.dmId        
      });

      this.dialog.closeAll();
      this.devspaceService.editCreatorMessage(this.data.section, -1);
    } catch (error) {
      console.error('error with saving message:', error);
    }
  }

  deleteMessage(){
    this.dialog.open(DeleteAreaComponent, {data: this.data});    
  }

 

}
