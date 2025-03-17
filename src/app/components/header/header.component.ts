import { Component } from '@angular/core';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';


@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public devspaceService: DevspaceService) { }
  placeholder() {
    if (window.innerWidth > 768) {
      return "Devspace durchsuchen"
    } else {
      return "Gehe zu.."
    }
  }
}
