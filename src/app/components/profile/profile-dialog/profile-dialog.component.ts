import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { IconSize } from '../../../shared/Enums/iconSize';
import { Color } from '../../../shared/Enums/color';
@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class ProfileDialogComponent {
  iconColor = Color.Black;
  iconSize: string = IconSize.Medium;
  Color = Color;
  constructor(private dialogRef: MatDialogRef<ProfileDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
