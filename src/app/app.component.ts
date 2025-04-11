import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FirestoreService } from './shared/services/firestore-service/firestore.service';
import { DevspaceService } from './shared/services/devspace-service/devspace.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('logo') logo!: ElementRef<HTMLInputElement>;
  isDashboardRoute = false;
  isSmallDisplay = false;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private devspaceService: DevspaceService
  ) {}

  async ngOnInit(): Promise<void> {
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

    const uid = getAuth().currentUser?.uid;
    if (uid) {
      await this.firestoreService.updateUserInFirestore(uid, { online: true });
    }
  }

  async ngOnDestroy(): Promise<void> {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
      await this.firestoreService.updateUserInFirestore(uid, { online: false });
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: Event) {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
      navigator.sendBeacon(
        `https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=online`,
        JSON.stringify({
          fields: {
            online: { booleanValue: false }
          }
        })
      );
    }
  }
}
