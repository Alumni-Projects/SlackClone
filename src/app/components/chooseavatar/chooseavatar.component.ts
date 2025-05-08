import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Color } from '@shared/Enums/color';
import { IconSize } from '@shared/Enums/iconSize';

@Component({
  selector: 'app-chooseavatar',
  templateUrl: './chooseavatar.component.html',
  styleUrls: ['./chooseavatar.component.scss'],
  imports: [MatIconModule, CommonModule],
  standalone: true
})
export class ChooseAvatarComponent implements OnInit {
  [x: string]: any;
  avatarImage = 'assets/avatar/avatar0.svg';
  username = 'Frederik Beck';
  iconColor = Color.Black;
  iconSize: string = IconSize.Small;
  Color = Color;
  isMobile = false;

  avatars = [
    { src: 'assets/avatar/avatar1.svg' },
    { src: 'assets/avatar/avatar2.svg' },
    { src: 'assets/avatar/avatar3.svg' },
    { src: 'assets/avatar/avatar4.svg' },
    { src: 'assets/avatar/avatar5.svg' },
    { src: 'assets/avatar/avatar6.svg' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    if (!this.avatarImage || this.avatarImage === '') {
      this.avatarImage =
        this.avatars.length > 0
          ? this.avatars[0].src
          : 'assets/avatar/avatar0.svg';
    }

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  chooseAvatar(avatar: { src: string }) {
    this.avatarImage = avatar.src;
  }
}
