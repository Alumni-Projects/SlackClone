import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { IconSize } from '../Enums/iconSize';
import { Color } from '../Enums/color';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chooseavatar',
  templateUrl: './chooseavatar.component.html',
  styleUrls: ['./chooseavatar.component.scss'],
  imports: [MatIconModule, CommonModule],
  standalone: true
})

export class ChooseAvatarComponent implements OnInit {
  avatarImage = '/assets/avatars/avatar1.svg';
  userName = 'Frederik Beck';
  iconColor = Color;
  iconSize: string = IconSize.Medium;
  Color = Color;
  isMobile = false;

  avatars = [
    { src: '/assets/avatar/avatar1.svg' },
    { src: '/assets/avatar/avatar2.svg' },
    { src: '/assets/avatar/avatar3.svg' },
    { src: '/assets/avatar/avatar4.svg' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }
}
