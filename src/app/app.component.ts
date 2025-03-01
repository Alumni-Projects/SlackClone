import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevspaceComponent } from './components/devspace/devspace.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DevspaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SlackClone';
}
