import { Component } from '@angular/core';
import { MessageInputAreaComponent } from "../message-input-area/message-input-area.component";

@Component({
  selector: 'app-thread',
  imports: [MessageInputAreaComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

}
