import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { IconSize } from '../Enums/iconSize';
import { Color } from '../Enums/color';

@Component({
  selector: 'app-chooseavatar',
  templateUrl: './chooseavatar.component.html',
  styleUrls: ['./chooseavatar.component.css'],
  imports: [MatIconModule],
  standalone: true
})
export class ChooseAvatarComponent {
[x: string]: any;
  avatarImage = '/assets/avatar/avatar1.svg';
  userName = 'Frederik Beck'; 
iconColor = Color;
iconSize: string = IconSize.Medium;
Color = Color;
}