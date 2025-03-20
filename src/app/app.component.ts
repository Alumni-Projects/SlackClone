import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isDashboardRoute = false;
  isSmallDisplay = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDashboardRoute = event.urlAfterRedirects === '/dashboard';
        if (event.urlAfterRedirects === '/login')
          this.isSmallDisplay = window.innerHeight < 900 && window.innerWidth < 768;
      }
    });


  }


}
