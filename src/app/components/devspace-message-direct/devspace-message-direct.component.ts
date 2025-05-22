import { Component } from '@angular/core';
import { MessageInputAreaComponent } from '@components/message-input-area/message-input-area.component';
import { MessageAreaComponent } from "../message-area/message-area.component";
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMessagesMemberComponent } from './delete-messages-member/delete-messages-member.component';


@Component({
  selector: 'app-devspace-message-direct',
  imports: [MessageInputAreaComponent, MessageAreaComponent],
  templateUrl: './devspace-message-direct.component.html',
  styleUrl: './devspace-message-direct.component.scss'
})
export class DevspaceMessageDirectComponent {

  constructor(public devspaceService: DevspaceService,
    public firestore: FirestoreService,
    public dialog: MatDialog) { }

  deleteDirectMessage() {
    this.dialog.open(DeleteMessagesMemberComponent);
  }

}
