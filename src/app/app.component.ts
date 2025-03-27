import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent {
  @ViewChild('logo') logo!: ElementRef<HTMLInputElement>;
  isDashboardRoute = false;
  isSmallDisplay = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDashboardRoute = event.urlAfterRedirects === '/dashboard';
        this.isSmallDisplay = window.innerHeight < 900 && window.innerWidth < 768;
      }
    });

    setTimeout(() => {
      const logo = this.logo.nativeElement;
      logo.style.display = 'none';
    }, 4500);

  }


}