import { Component } from '@angular/core';
import { AuthService } from '@shared/services/auth-service/auth.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';


@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public devspaceService: DevspaceService, private authService: AuthService) { }
  placeholder() {
    if (window.innerWidth > 768) {
      return "Devspace durchsuchen"
    } else {
      return "Gehe zu.."
    }
  }

  logout() {
    this.authService.logout();
  }
}
