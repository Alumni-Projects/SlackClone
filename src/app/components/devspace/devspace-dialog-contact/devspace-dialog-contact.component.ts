import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-devspace-dialog-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './devspace-dialog-contact.component.html',
  styleUrl: './devspace-dialog-contact.component.scss'
})
export class DevspaceDialogContactComponent implements OnInit {
  lastChannel?: string;
  isDisabled = true;
  openSelect = false;
  openSelectContact = false;
  selectContactsChecked = false;
  allContactsChecked = false;
  inputValue = '';
  selectedCheckbox: string | null = null;
  accounts: DevspaceAccount[] = [];
  accountSelected: DevspaceAccount[] = [];

  @ViewChild('contactInput') contactInput!: ElementRef<HTMLInputElement>;

  constructor(
    private dialog: MatDialog,
    public devspaceService: DevspaceService,
    public breakpoints: BreakpointsService,
    public firestore: FirestoreService,
    
  ) {}

  ngOnInit(): void {
    this.lastChannel = this.devspaceService.channelsName;
  }

  get filteredAccounts(): DevspaceAccount[] {
    return this.devspaceService.accounts.filter(
      (acc) =>
        acc.uid !== this.devspaceService.loggedInUserUid &&
        acc.displayName.toLowerCase().startsWith(this.inputValue.toLowerCase())
    );
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onCheckboxChange(selectedId: string): void {
    const all = document.getElementById('allContacts') as HTMLInputElement;
    const selected = document.getElementById(
      'selectedContacts'
    ) as HTMLInputElement;

    if (selectedId === 'allContacts') {
      all.checked = true;
      selected.checked = false;
      this.isDisabled = false;
      this.allContactsChecked = true;
      this.selectContactsChecked = false;
    } else if (selectedId === 'selectedContacts') {
      all.checked = false;
      selected.checked = true;
      this.isDisabled = this.accountSelected.length === 0;
      this.allContactsChecked = false;
      this.selectContactsChecked = true;
    } else {
      all.checked = false;
      selected.checked = false;
      this.isDisabled = true;
      this.allContactsChecked = false;
      this.selectContactsChecked = false;
    }

    this.selectedCheckbox = selectedId;
    this.openSelect = selectedId === 'selectedContacts';
  }

  selectContact(i: number): void {
    const contact = this.filteredAccounts[i];
    if (!this.accountSelected.find((acc) => acc.uid === contact.uid)) {
      this.accountSelected.push(contact);
      this.inputValue = '';
    }
    this.isDisabled = this.accountSelected.length === 0;
    this.selectContactsChecked = this.accountSelected.length > 0;
  }

  removeContact(i: number): void {
    this.accountSelected.splice(i, 1);
    this.isDisabled = this.accountSelected.length === 0;
  }

  focusInput(): void {
    this.contactInput.nativeElement.focus();
  }

  SelectContact(): void {
    this.openSelectContact = !this.openSelectContact;
    this.inputValue = '';
  }

  SelectContactClose(): void {
    this.openSelectContact = false;
  }

  addChannel(): void {
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.activeDMContact = null;
    const timestamp = new Date().toISOString();
    const baseChannel = {
      title: this.devspaceService.channelsName,
      description: this.devspaceService.channelsDescription,
      creator: this.devspaceService.loggedInUserUid,
      createdAt: timestamp
    };

    if (this.allContactsChecked) {
      const members = this.devspaceService.accounts.map((a) => a.uid);
      this.firestore.saveChannelToFirestore({
        ...baseChannel,
        member: members
      });
    } else if (this.selectContactsChecked) {      
      const selectedUids = this.accountSelected.map((a) => a.uid);
      this.firestore.saveChannelToFirestore({
        ...baseChannel,
        member: [...selectedUids, this.devspaceService.loggedInUserUid]
      });
    }

    setTimeout(() => this.activateLastCreatedChannel(), 100);
    this.dialog.closeAll();
  }

  activateLastCreatedChannel(): void {
    const last = this.firestore.lastAddedChannel;
    this.devspaceService.selectedChannelId = last?.id || '';
    this.devspaceService.openChannel = true;
  }
}
