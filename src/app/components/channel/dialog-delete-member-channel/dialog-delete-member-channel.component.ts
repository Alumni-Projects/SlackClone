import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-dialog-delete-member-channel',
  imports: [],
  templateUrl: './dialog-delete-member-channel.component.html',
  styleUrl: './dialog-delete-member-channel.component.scss'
})
export class DialogDeleteMemberChannelComponent {
constructor (public firestore: FirestoreService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: { index: number; channelId: string; userId: string; userName: string } ) { 
  console.log("Empfangene Daten im Dialog:", data);
}

close() {
  this.dialog.closeAll();
}

deleteMember(){
  this.firestore.deleteChannelMemberFromFirestore(this.data.channelId, this.data.userId);
  this.dialog.closeAll();
}


}
