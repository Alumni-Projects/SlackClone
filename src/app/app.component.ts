import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FirestoreService } from './shared/services/firestore-service/firestore.service';
import { DevspaceService } from './shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('logo') logo!: ElementRef<HTMLInputElement>;
  isDashboardRoute = false;
  isSmallDisplay = false;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private devspaceService: DevspaceService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDashboardRoute = event.urlAfterRedirects === '/dashboard';
        this.isSmallDisplay =
          window.innerHeight < 900 && window.innerWidth < 768;
      }
    });

    setTimeout(() => {
      const logo = this.logo.nativeElement;
      logo.style.display = 'none';
    }, 4500);

    this.firestoreService.initUser(this.devspaceService);
  }
}
