import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageInputAreaComponent } from "../message-input-area/message-input-area.component";
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { MatDialog } from '@angular/material/dialog';
import { EditChannelDialogComponent } from './edit-channel-dialog/edit-channel-dialog.component';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { Subscription } from 'rxjs';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Devspace } from '@shared/interface/devspace';


@Component({
  selector: 'app-channel',
  imports: [MessageInputAreaComponent, CommonModule, FormsModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent implements OnInit {
  @ViewChild('contactSelect') contactSelect!: ElementRef<HTMLInputElement>;
  private subscriptions: Subscription = new Subscription();
  filterChannel: any[] = [];
  filterContact: any[] = [];
  accountSelected: DevspaceAccount[] = [];
  openSelectContact = false;
  accounts;
  filtedContacts: DevspaceAccount[] = [];
  isDisabled = true;
  openSelect = false;
  memberValue = '';
  constructor(public devspaceService: DevspaceService, public dialog: MatDialog, public firestore: FirestoreService) {
    this.accounts = this.devspaceService.accounts;
    this.accountSelected = [];
  }
  

  ngOnInit(): void {
    this.subscriptions = this.firestore.channels$.subscribe(channels => {
      this.filterChannel = channels.filter(
        channel => this.devspaceService.selectedChannelId == channel.id
      );      
      this.filterContacts();
      this.filterContactForAddInput();
    });

  }

  get filteredAccounts(): DevspaceAccount[] {
    return this.filtedContacts
      .filter(account => account.displayName.toLowerCase().startsWith(this.memberValue.toLowerCase()));
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

  filterContactForAddInput() {
    const channel = this.filterChannel[0];
  
    this.filtedContacts = this.accounts.filter(member =>
      !channel?.member?.includes(member.uid)
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

  openMemberAdd() {
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = true;
    
  }

  closeMemberAdded() {
    this.devspaceService.channelMember = false;    
    this.accountSelected= [];
    this.memberValue = '';
    this.devspaceService.channelMemberAdded = false;
  }


  selectContact(i: number) {
    if (!this.accountSelected?.some(item => item.displayName === this.filteredAccounts[i].displayName)) {
      this.accountSelected!.push(this.filteredAccounts[i]);
      this.memberValue = '';
    }
    if (this.accountSelected.length > 0) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }

  }

  removeContact(i: number) {
    this.accountSelected.splice(i, 1);
    this.openSelectContact = false;
    if (this.accountSelected.length > 0) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  SelectContact() {
    this.openSelectContact = !this.openSelectContact;
    this.memberValue = '';
  }

  SelectContactClose() {
    this.openSelectContact = false;
  }

  focusInput() {
    this.contactSelect.nativeElement.focus();
  }

  async addMember() {
    const channel = this.filterChannel;
    const channelId = channel[0].id;     
    const promises = this.accountSelected.map(user =>
      this.firestore.newChannelMemberToFirestore(channelId, user.uid ?? null)
    );
  
    try {
      await Promise.all(promises);      
      this.closeMemberAdded();
    } catch (error) {
      console.error("Error when adding members:", error);
    }
  }



}
