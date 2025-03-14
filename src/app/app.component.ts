import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevspaceComponent } from './components/devspace/devspace.component';
import { WorkspaceOpenCloseComponent } from './components/workspace-open-close/workspace-open-close.component';
import { DevspaceMessageComponent } from './components/devspace-message/devspace-message.component';

import { ThreadComponent } from './components/thread/thread.component';
import { HeaderComponent } from './components/header/header.component';
import { ChannelComponent } from './components/channel/channel.component';
import { DevspaceService } from './shared/Service/devspace.service';
import { DevspaceMessageDirectComponent } from './components/devspace-message/devspace-message-direct/devspace-message-direct.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DevspaceComponent,WorkspaceOpenCloseComponent,DevspaceMessageComponent,DevspaceMessageDirectComponent ,ThreadComponent,HeaderComponent,ChannelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
 constructor( public devspaceService: DevspaceService) {}
}
