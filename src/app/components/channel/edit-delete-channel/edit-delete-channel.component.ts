import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteMessage } from '@shared/interface/delete-message';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-edit-delete-channel',
  imports: [],
  templateUrl: './edit-delete-channel.component.html',
  styleUrl: './edit-delete-channel.component.scss'
})
export class EditDeleteChannelComponent {

  constructor(public devspaceService: DevspaceService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public firestore: FirestoreService, public breakpoints: BreakpointsService) {
  }

  close() {
    this.dialog.closeAll();
  }
  leaveChannel() {
    const channelid = this.data.channel.id;
    if (this.data.channel.creator == this.devspaceService.loggedInUserUid) {
      this.firestore.deleteChannelFromFirestore(channelid);
      this.devspaceService.openChannel = false;
      this.devspaceService.selectedChannelId = '';
      if (this.breakpoints.breankpointMain) {
        this.devspaceService.openDevspace = true;
      }

    } else {
      this.devspaceService.selectedChannelId = '';
      this.devspaceService.openChannel = false;
      if (this.breakpoints.breankpointMain) {
        this.devspaceService.openDevspace = true;
      }
      setTimeout(() => {
        const memberChange = false;
        this.firestore.changeChannelMembers(channelid, this.devspaceService.loggedInUserUid, memberChange);
      }, 100)
    }

    if (this.breakpoints.breankpointMain) {
      this.devspaceService.openDevspace = true;
    }
    this.dialog.closeAll();
  }

}
