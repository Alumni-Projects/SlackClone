import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconSize } from '../../Enums/iconSize';
import { Color } from '../../Enums/color';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
imports: [MatIconModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  iconColor = Color.Black;
  iconSize: string = IconSize.Small;
  Color = Color;
}
