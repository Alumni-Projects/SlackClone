import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import { CommonModule } from '@angular/common';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [MatIconModule, MatMenuModule, ProfilePopupComponent, CommonModule]
})
export class ProfileComponent {
  constructor(
    private dialog: MatDialog,
    private devspaceService: DevspaceService
  ) {}

  isProfileOpen = false;

  logout() {}

  openProfileDialog() {
    if (this.devspaceService.activeUser) {
      this.dialog.open(ProfileDialogComponent, {
        data: { uid: this.devspaceService.activeUser.uid },
        panelClass: 'custom-dialog-class'
      });
    }
  }
}
