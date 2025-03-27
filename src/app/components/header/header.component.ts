import { Component } from '@angular/core';
import { AuthService } from '@shared/services/auth-service/auth.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfilePopupComponent } from '../profile/profile-popup/profile-popup.component';
import { MatIcon } from '@angular/material/icon';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ProfilePopupComponent, MatIcon]
})
export class HeaderComponent {

  isProfileOpen = false;
  Color = Color;
  IconSize = IconSize;
  constructor(
    public devspaceService: DevspaceService,
    private dialog: MatDialog
  ) {}

  placeholder(): string {
    return window.innerWidth > 768 ? 'Devspace durchsuchen' : 'Gehe zu..';
  }

  openProfilePopup(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

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
