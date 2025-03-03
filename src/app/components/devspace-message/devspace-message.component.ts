import { Component } from '@angular/core';
import { DevspaceService } from '../../shared/Service/devspace.service';

@Component({
  selector: 'app-devspace-message',
  imports: [],
  templateUrl: './devspace-message.component.html',
  styleUrl: './devspace-message.component.scss'
})
export class DevspaceMessageComponent {

  constructor(public devspaceService: DevspaceService) { }

}
