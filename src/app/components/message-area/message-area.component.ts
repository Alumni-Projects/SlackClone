import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-message-area',
  imports: [CommonModule],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.scss'
})
export class MessageAreaComponent {
@Input() messageSection!:  'channel' | 'thread' | 'directmessage';

constructor(public devspaceService: DevspaceService, public firestore: FirestoreService) {

  switch (this.messageSection) {
    case 'channel':
      
      break;
    case 'thread':
      
      break;
    case 'directmessage':
      
      break;
    default:
      
      break;
  }
  
  
}
}
