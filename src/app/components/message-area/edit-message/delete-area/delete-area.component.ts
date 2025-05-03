import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteMessage } from '@shared/interface/delete-message';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-delete-area',
  imports: [],
  templateUrl: './delete-area.component.html',
  styleUrl: './delete-area.component.scss'
})
export class DeleteAreaComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteMessage,
    private dialog: MatDialog,
    private firestore: FirestoreService,
    private dialogRef: MatDialogRef<DeleteAreaComponent>,
    private devspaceService: DevspaceService
  ) {

  }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteMessage() {
    this.dialog.closeAll();
    if (this.data.section === 'channel') {
      const message = this.data.message;
      const channelId = this.data.channelId;
      this.firestore.deleteMessage({
        message,
        channelId
      });
      this.devspaceService.openThread = false;
    } else if (this.data.section === 'thread') {
      const threadMessage = this.data.message;
      const channelId = this.data.channelId;
      const parentMessageId = threadMessage.parentId!;
      const threadId = threadMessage.id!;
      this.firestore.deleteMessage({
        message: threadMessage,
        channelId,
        parentMessageId,
        threadId
      });
    }else if (this.data.section === 'directmessage') {
      console.log('directmessage');      
      const message = this.data.message;
      const dmId = this.data.dmId;
      this.firestore.deleteMessage({
        message,
        dmId
      });
    }
    this.devspaceService.editCreatorMessage(this.data.section, -1);

  }
}
