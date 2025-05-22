import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatIconModule]
})
export class ProfileDialogComponent {
  closeDialog() {
    this.dialogRef.close();
  }
  IconColor = Color;
  IconSize = IconSize;
  isProfileOpen = false;
  editName = false;
  constructor(private dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public devspaceService: DevspaceService,
    public firestoreService: FirestoreService,
    public breakpoints: BreakpointsService,) {

  }

  async saveName(name: string) {
    const userId = this.data.user.uid;
    this.data.user.displayName = name;
    this.loadNewNameOfPage(name);
    await this.firestoreService.logUserUpdateName(userId, name);
    this.closeAll();
    this.editName = false;

  }

  closeAll() {
    this.devspaceService.selectedChannelId = '';
    this.devspaceService.openChannel = false;
    this.devspaceService.openDevspace = true;
    this.devspaceService.openMessage = false;
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.openThread = false;
    this.devspaceService.activeDMContact = null;
  }

  loadNewNameOfPage(name: string) {
    const nameAccount: any = this.devspaceService.dmAccounts.find(x => x.userData.uid === this.data.user.uid);
    nameAccount.userData.displayName = name;
  }

  sendMessage() {
    this.devspaceService.openMessage = false;
    this.devspaceService.openChannel = false;
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.openThread = false;
    this.devspaceService.activeDMContact = null;
    if (this.breakpoints.breankpointMain) {
      this.devspaceService.openDevspace = false;
    }
    this.devspaceService.sendMessageUser$.next(null); 
    this.devspaceService.sendMessageUserData$.next(null);
    this.devspaceService.sendMessageUser$.next(this.data.user.displayName);
    this.devspaceService.sendMessageUserData$.next(this.data.user);
    this.devspaceService.openMessage = true;
    this.dialogRef.close();
  }
}
