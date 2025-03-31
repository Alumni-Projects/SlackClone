import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Importieren!
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { DevspaceAccount } from '@shared/interface/devspace-account';

@Component({
  selector: 'app-devspace-dialog-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './devspace-dialog-contact.component.html',
  styleUrl: './devspace-dialog-contact.component.scss'
})
export class DevspaceDialogContactComponent implements OnInit {
  lastChannel?: any;
  isDisabled: boolean = true;
  openSelect: boolean = false;
  inputValue = '';
  selectedCheckbox: string | null = null;
  accounts;
  accountSelected: DevspaceAccount[] = [];
  openSelectContact: boolean = false;
  allContactsChecked: boolean = false;
  selectContactsChecked: boolean = false;

  @ViewChild('contactInput') contactInput!: ElementRef<HTMLInputElement>;

  constructor(private dialog: MatDialog, public devspaceService: DevspaceService, public breakpoints: BreakpointsService) {
    this.accounts = this.devspaceService.accounts;
    this.accountSelected = [];

  }

  ngOnInit(): void {
    this.lastChannel = this.devspaceService.channelsName;
  }

  get filteredAccounts(): DevspaceAccount[] {
    return this.accounts
      .filter(account => account.displayName.toLowerCase().startsWith(this.inputValue.toLowerCase()));
  }
  closeDialog() {
    this.dialog.closeAll();
  }


  onCheckboxChange(selectedId: string) {
    const checkboxes = ['allContacts', 'selectedContacts'];
    let isChecked = false;
    let isSelectedContactsChecked = false;

    checkboxes.forEach(id => {
      const checkbox = document.getElementById(id) as HTMLInputElement;
      if (checkbox) {
        if (id !== selectedId) {
          checkbox.checked = false;
        }
        if (checkbox.checked) {
          isChecked = true;
          this.selectedCheckbox = id;
          if (id === 'selectedContacts') {
            isSelectedContactsChecked = true;
            this.isDisabled = true;
          }
          if (id === 'allContacts') {
            this.isDisabled = false;
            this.allContactsChecked = true;
          }
        }
      }
    });

    if (!isChecked) {
      this.selectedCheckbox = null;
      this.isDisabled = true;
    }
    this.openSelect = isSelectedContactsChecked;

  }

  selectContact(i: number) {
    if (!this.accountSelected?.some(item => item.displayName === this.filteredAccounts[i].displayName)) {
      this.accountSelected!.push(this.filteredAccounts[i]);
      this.inputValue = '';
    }
    if (this.accountSelected.length > 0) {
      this.isDisabled = false;
      this.selectContactsChecked = true;
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
    this.openSelectContact = true;
    this.inputValue = '';
  }

  SelectContactClose() {
    this.openSelectContact = false;
  }

  focusInput() {
    this.contactInput.nativeElement.focus();
  }

  addChannel() {
    this.channelDirectMessageCloseSelect();
    this.devspaceService.closAllMessage();
    const creater = this.filterMainContact();

    if (this.allContactsChecked) {
      const contactsAll = this.devspaceService.accounts.map(account => account);
      let channel = { name: this.devspaceService.channelsName, description: this.devspaceService.channelsDescription, channelCreated: creater, channelActiveTalk: true, contact: contactsAll };
      this.devspaceService.channels.push(channel);
      console.log(contactsAll);
      console.log(this.devspaceService.channels);
    }

    if (this.selectContactsChecked) {
      const contactsSelect = this.accountSelected.map(account => account);
      let channel = { name: this.devspaceService.channelsName, description: this.devspaceService.channelsDescription, channelCreated: creater, channelActiveTalk: true, contact: contactsSelect };
      this.devspaceService.channels.push(channel);
      console.log(contactsSelect);
      console.log(this.devspaceService.channels);

    }

    this.dialog.closeAll();
    setTimeout(() => {
      this.devspaceService.openChannel = true;
    }, 100);

  }
  channelDirectMessageCloseSelect() {
    this.devspaceService.channels.forEach((channel,) => {
      channel.channelActiveTalk = false;
    })
    this.devspaceService.accounts.forEach((account,) => {
      account.activeMessage = false;
    })
  }

  filterMainContact() {
    const creater = this.devspaceService.accounts.filter(account => account.activeSelf == true);
    return creater;
  }

}
