import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIcon
  ]
})
export class ProfileDialogComponent {
  constructor(private dialogRef: MatDialogRef<ProfileDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
