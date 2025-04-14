import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';

import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatIconModule, ReactiveFormsModule]
})
export class ProfileDialogComponent implements OnInit {
  IconColor = Color;
  IconSize = IconSize;

  nameControl = new FormControl<string | null>('', [Validators.required]);
  isEditing = false;
  isOwnProfile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { uid?: string },
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private devspaceService: DevspaceService,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit(): Promise<void> {
    const activeUser = this.devspaceService.activeUser;
    const fallbackUid = activeUser?.uid;
    const uid = this.data?.uid || fallbackUid;

    if (!uid) return;

    this.isOwnProfile = !this.data?.uid || this.data.uid === activeUser?.uid;

    if (this.isOwnProfile && activeUser) {
      this.nameControl.setValue(activeUser.displayName);
    }
  }

  get user(): DevspaceAccount | null {
    return this.devspaceService.activeUser;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openEditDialog(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  async changeName(): Promise<void> {
    const uid = this.user?.uid;
    const newName = this.nameControl.value?.trim();

    if (!uid || !newName) return;

    try {
      await this.firestoreService.updateUserInFirestore(uid, {
        displayName: newName
      });
      this.isEditing = false;
    } catch {}
  }
}
