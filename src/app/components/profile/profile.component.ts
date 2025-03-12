import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [MatIconModule, MatMenuModule]
})
export class ProfileComponent {
  constructor(private dialog: MatDialog) {}

  openProfile() {
    this.dialog.open(ProfileDialogComponent, {
      width: '500px', 
      panelClass: "profile-menu"
    });
  }

  logout() {
    console.log('Logout geklickt'); 
  }
}
