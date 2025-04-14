import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-delete-member-channel',
  imports: [CommonModule, MatIconModule],
  templateUrl: './dialog-delete-member-channel.component.html',
  styleUrl: './dialog-delete-member-channel.component.scss'
})
export class DialogDeleteMemberChannelComponent {
  constructor(
    public firestore: FirestoreService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      index: number;
      channelId: string;
      userId: string;
      userName: string;
    }
  ) {
    console.log('Empfangene Daten im Dialog:', data);
  }
  Color = Color;
  IconSize = IconSize;
  close() {
    this.dialog.closeAll();
  }

  deleteMember() {
    const memberChange = false;
    this.firestore.changeChannelMembers(
      this.data.channelId,
      this.data.userId,
      memberChange
    );
    this.dialog.closeAll();
  }
}
