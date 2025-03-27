import { Component } from '@angular/core';
import { MessageInputAreaComponent } from "../message-input-area/message-input-area.component";

@Component({
  selector: 'app-channel',
  imports: [MessageInputAreaComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

}
