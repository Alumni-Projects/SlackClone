import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { AuthService } from '@shared/services/auth-service/auth.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.scss'],
  imports: [MatIconModule, CommonModule, MatDialogModule]
})
export class ProfilePopupComponent {
  Color = Color;
  IconSize = IconSize;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  isClosing = false;

  constructor(private dialog: MatDialog, public authService: AuthService, public firestore: FirestoreService, public devspaceService: DevspaceService) { }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isOpen) {
      this.startCloseAnimation();
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  openProfileDialog() {
    this.dialog.open(ProfileDialogComponent, {
      width: '500px',
      panelClass: 'profile-menu',
      data: { user: this.filterContact(this.devspaceService.loggedInUserUid) }
    });
    this.startCloseAnimation();
  }

  filterContact(userId: string) {
    const data = this.devspaceService.accounts.find(account => account.uid === userId);
    return data;

  }

  startCloseAnimation() {
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.close.emit();
    }, 200);
  }

  async logout() {
    await this.firestore.changeUserStatus(this.devspaceService.loggedInUserUid, false);
    this.firestore.cleanupFirestoreListeners();
    this.authService.logout();
  }
}
