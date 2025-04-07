import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import {
  DevspaceAccount,
  DevspaceService
} from '@shared/services/devspace-service/devspace.service';
import { getAuth } from 'firebase/auth';

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
  emailControl = new FormControl<string | null>('', [
    Validators.required,
    Validators.email
  ]);
  secretData!: { email: string };

  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private devspaceService: DevspaceService,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = getAuth().currentUser;
    if (!user) return;

    this.secretData = await this.firestoreService.fetchSecretData(user.uid);
  }

  get user(): DevspaceAccount | null {
    return this.devspaceService.activeUser;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openEditDialog(): void {}
}
