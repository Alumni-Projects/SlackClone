import { Component } from '@angular/core';
import { MessageInputAreaComponent } from "../message-input-area/message-input-area.component";
import { MessageAreaComponent } from '@components/message-area/message-area.component';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { FormatMessageDatePipe } from "../../shared/services/TimeFormat/format-message-date.pipe";

@Component({
  selector: 'app-thread',
  imports: [MessageInputAreaComponent, MessageAreaComponent, FormatMessageDatePipe],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

  constructor(public devspaceService: DevspaceService, public firestore: FirestoreService) { }

  get userMainMessage() {
    if (!this.firestore.selectedThreadMessage) {
      throw new Error('selectedThreadMessage is null or undefined');
    }
    return this.firestore.selectedThreadMessage;
  }

  closeThread() {

    this.devspaceService.openThread = false;

  }
}
