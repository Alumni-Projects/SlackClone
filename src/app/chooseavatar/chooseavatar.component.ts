import { Component } from '@angular/core';

@Component({
  selector: 'app-chooseavatar',
  templateUrl: './chooseavatar.component.html',
  styleUrls: ['./chooseavatar.component.css'],
  standalone: true
})
export class ChooseAvatarComponent {
  avatarImage = '/assets/avatar/avatar1.svg';
  userName = 'Frederik Beck'; 
}