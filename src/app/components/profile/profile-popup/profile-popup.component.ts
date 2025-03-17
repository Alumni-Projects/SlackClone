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

  constructor(private dialog: MatDialog) { }

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
      panelClass: 'profile-menu'
    });
    this.startCloseAnimation();
  }

  startCloseAnimation() {
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.close.emit();
    }, 200);
  }
}
