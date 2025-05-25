import { Component } from '@angular/core';
import { ChannelComponent } from '@components/channel/channel.component';
import { DevspaceMessageDirectComponent } from '@components/devspace-message-direct/devspace-message-direct.component';
import { DevspaceMessageComponent } from '@components/devspace-message-new/devspace-message.component';
import { DevspaceComponent } from '@components/devspace/devspace.component';
import { HeaderComponent } from '@components/header/header.component';
import { ThreadComponent } from '@components/thread/thread.component';
import { WorkspaceOpenCloseComponent } from '@components/workspace-open-close/workspace-open-close.component';
import { AuthService } from '@shared/services/auth-service/auth.service';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    DevspaceComponent,
    WorkspaceOpenCloseComponent,
    DevspaceMessageComponent,
    DevspaceMessageDirectComponent,
    ThreadComponent,
    HeaderComponent,
    ChannelComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isAnonymous = false;
  private userSub!: Subscription;
  constructor(public devspaceService: DevspaceService, public firestore: FirestoreService, public breakpoints: BreakpointsService
  ,public auth: AuthService) { }

  async ngOnInit() {
     this.userSub = this.auth.user$.subscribe(user => {
      this.isAnonymous = !!user?.isAnonymous;
    });
    await this.loadLoggedInUser();
    await this.loadUsers();
    this.loadDmUsers();
    this.firestore.subscribeToUserChannels(this.devspaceService.loggedInUserUid);
    this.devspaceService.Firestore.channels$.subscribe(channels => {
    });
    this.breakpoints.isMobile$.subscribe(value => {
      if (this.devspaceService.openChannel && value || this.devspaceService.openMessage && value || this.devspaceService.openDirectMessage && value) { this.devspaceService.openDevspace = false; }
    });
  }

   ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async loadUsers() {
    const users = await this.firestore.fetchUserFromFirestoreAll();
    this.devspaceService.accounts = users;
    this.devspaceService.mainAccount = this.devspaceService.accounts.find(acc => acc.uid === this.devspaceService.loggedInUserUid)
  }

   async loadLoggedInUser() {   
    if (this.isAnonymous) {
      this.devspaceService.loggedInUserUid = '34AIndSsa2QhAkjvWW2x';
      await this.firestore.changeUserStatus(this.devspaceService.loggedInUserUid, true);      
    } else {
      this.devspaceService.loggedInUserUid = this.auth.getUser()!.uid;
      await this.firestore.changeUserStatus(this.devspaceService.loggedInUserUid, true);      
    }
  }

  async loadDmUsers() {
    this.devspaceService.dmAccounts = await this.firestore.findDmUsers(this.devspaceService.loggedInUserUid);
  }
}
