import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChooseAvatarComponent } from './chooseavatar/chooseavatar.component';
import { DevspaceComponent } from './components/devspace/devspace.component';
import { WorkspaceOpenCloseComponent } from './components/workspace-open-close/workspace-open-close.component';
import { DevspaceMessageComponent } from './components/devspace-message/devspace-message.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DevspaceComponent,WorkspaceOpenCloseComponent,DevspaceMessageComponent,ChooseAvatarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SlackClone';
}
