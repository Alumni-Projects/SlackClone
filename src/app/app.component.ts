import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatTopbarComponent } from './components/chat-topbar/chat-topbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatTopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SlackClone';
}
