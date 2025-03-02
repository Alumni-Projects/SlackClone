import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevspaceComponent } from './components/devspace/devspace.component';
import { WorkspaceOpenCloseComponent } from './components/workspace-open-close/workspace-open-close.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DevspaceComponent,WorkspaceOpenCloseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SlackClone';
}
