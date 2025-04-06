import { Component, OnInit } from '@angular/core';
import { MessageInputAreaComponent } from "../message-input-area/message-input-area.component";
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { MatDialog } from '@angular/material/dialog';
import { EditChannelDialogComponent } from './edit-channel-dialog/edit-channel-dialog.component';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel',
  imports: [MessageInputAreaComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  constructor(public devspaceService: DevspaceService, public dialog: MatDialog, public firestore: FirestoreService) { }
  filterChannel: any[] = [];
  filterContact: any[] = [];

  ngOnInit(): void {
    this.subscriptions = this.firestore.channels$.subscribe(channels => {
      this.filterChannel = channels.filter(
        channel => this.devspaceService.selectedChannelId == channel.id
      );
      console.log('Aktualisierte Channels:', this.filterChannel);
      this.filterContacts();
    });

  }

  filterContacts() {
    const channel = this.filterChannel[0];
    if (!channel || !Array.isArray(channel.member)) {
      this.filterContact = [];
      return;
    }
    this.filterContact = this.devspaceService.accounts.filter(member =>
      channel.member.includes(member.uid)
    );

  }

  openEditChannelDialog() {
    this.dialog.open(EditChannelDialogComponent, {
      position: { top: '200px' }
    });
  }

  openMember() {
    this.devspaceService.channelMember = true;
    this.devspaceService.channelMemberAdded = false;
  }

  profile(i: number) {
    console.log("Profile", i);
  }

  closeMember() {
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
  }

  openMemberAdd(){
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = true;
  }

  closeMemberAdded(){
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
  }

}
