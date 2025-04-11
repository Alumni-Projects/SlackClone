import { Component } from '@angular/core';
import { MessageInputAreaComponent } from "../message-input-area/message-input-area.component";
import { MessageAreaComponent } from '@components/message-area/message-area.component';

@Component({
  selector: 'app-thread',
  imports: [MessageInputAreaComponent,MessageAreaComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

}
