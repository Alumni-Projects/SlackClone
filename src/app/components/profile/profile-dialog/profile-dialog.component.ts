import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DevspaceAccount,
  DevspaceService
} from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { getAuth, updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

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

  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private devspaceService: DevspaceService
  ) {}

  ngOnInit(): void {
    const email = this.devspaceService.activeUser?.email;
    this.emailControl.setValue(email || '');
  }

  get user(): DevspaceAccount | null {
    return this.devspaceService.activeUser;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
