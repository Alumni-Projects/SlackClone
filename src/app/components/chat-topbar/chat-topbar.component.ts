import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-chat-topbar',
  templateUrl: './chat-topbar.component.html',
  imports: [CommonModule, MatIconModule, ProfileComponent],
  styleUrls: ['./chat-topbar.component.scss']
})
export class ChatTopbarComponent {
  iconColor = Color.Black;
  iconSize: string = IconSize.Small;
  Color = Color;
  onSendMessage($event: Event) {
    throw new Error('Method not implemented.');
  }
}