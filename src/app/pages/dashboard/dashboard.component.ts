import { Component } from '@angular/core';
import { ChannelComponent } from '@components/channel/channel.component';
import { DevspaceMessageDirectComponent } from '@components/devspace-message-direct/devspace-message-direct.component';
import { DevspaceMessageComponent } from '@components/devspace-message-new/devspace-message.component';
import { DevspaceComponent } from '@components/devspace/devspace.component';
import { HeaderComponent } from '@components/header/header.component';
import { ThreadComponent } from '@components/thread/thread.component';
import { WorkspaceOpenCloseComponent } from '@components/workspace-open-close/workspace-open-close.component';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

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
  constructor(
    public devspaceService: DevspaceService,
    public Firestore: FirestoreService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadLoggedInUser();
    console.log('DashboardComponent initialisiert.');
    this.Firestore.subscribeToUserChannels(
      this.devspaceService.loggedInUserUid
    );
    this.devspaceService.Firestore.channels$.subscribe((channels) => {
      console.log('DashboardComponent Channels:', channels);
    });
  }

  async loadUsers() {
    const users = await this.Firestore.fetchUserFromFirestoreAll();
    this.devspaceService.accounts = users;
  }

  loadLoggedInUser() {
    this.devspaceService.loggedInUserUid = 'zBAEMISe1FekXRBU0TDSRbdOC6q2';
  }
}
