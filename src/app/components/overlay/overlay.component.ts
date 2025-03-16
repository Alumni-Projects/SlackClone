import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overlay',
  imports: [],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      state('out', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      transition('out => in', animate('300ms ease-in')),
      transition('in => out', animate('300ms ease-out'))
    ])
  ]
})
export class OverlayComponent {
  isVisible = false;

  constructor(private router: Router) { }

  triggerAnimation(verify?: boolean) {
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
      if (verify) {
        this.goTo('verify-email');
      } else {
        this.goTo('login');
      }

    }, 2000);
  }

  goTo(target: string) {
    setTimeout(() => {
      this.router.navigate(['/' + target]);
    }, 1000)
  }

}
