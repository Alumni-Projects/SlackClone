import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';

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
  Color = Color;
  IconSize = IconSize;
  isProfileOpen = false;
  constructor(private dialogRef: MatDialogRef<ProfileDialogComponent>) { }
}
