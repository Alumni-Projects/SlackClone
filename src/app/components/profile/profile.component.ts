import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [MatIconModule, MatMenuModule, ProfilePopupComponent, CommonModule]
})
export class ProfileComponent {
  constructor(private dialog: MatDialog) {}
  isProfileOpen = false;

  logout() {
    console.log('Logout geklickt');
  }
  openProfilePopup() {
    this.isProfileOpen = !this.isProfileOpen;
  }
}
