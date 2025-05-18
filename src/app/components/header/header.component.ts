import { Component } from '@angular/core';
import { AuthService } from '@shared/services/auth-service/auth.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfilePopupComponent } from '../profile/profile-popup/profile-popup.component';
import { MatIcon } from '@angular/material/icon';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { SearchbarComponent } from '@components/searchbar/searchbar.component';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ProfilePopupComponent, MatIcon, SearchbarComponent],
  standalone: true
})
export class HeaderComponent {
  isProfileOpen = false;
  Color = Color;
  IconSize = IconSize;

  constructor(
    public devspaceService: DevspaceService,
    private authService: AuthService,
    private dialog: MatDialog,
    public breakpoints: BreakpointsService

  ) {}

  openProfilePopup(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  openDevspace(): void {
    this.closeMessage();
    this.devspaceService.openDevspace = true;
  }
  closeMessage(): void {
    this.devspaceService.activeDMContact = null;
    this.devspaceService.selectedChannelId = '';
    this.devspaceService.openChannel = false;
    this.devspaceService.openThread = false;
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.openMessage = false;
  }
}
