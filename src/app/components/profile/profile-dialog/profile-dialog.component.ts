import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatIconModule]
})
export class ProfileDialogComponent implements OnInit {
  displayName = '';
  IconColor = Color;
  IconSize = IconSize;

  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private devspaceService: DevspaceService
  ) {}

  ngOnInit(): void {
    console.log('🔎 activeUser:', this.devspaceService.activeUser);

    setTimeout(() => {
      this.displayName = this.devspaceService.getDisplayName();
      console.log('Displayname im Dialog:', this.displayName);
    }, 500);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
