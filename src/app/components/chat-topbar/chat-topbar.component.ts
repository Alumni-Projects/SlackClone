import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-topbar',
  templateUrl: './chat-topbar.component.html',
  styleUrls: ['./chat-topbar.component.scss']
})
export class ChatTopbarComponent {
  onSendMessage($event: Event) {
    throw new Error('Method not implemented.');
  }
}