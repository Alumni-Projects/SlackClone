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
      .filter(account => account.name.toLowerCase().startsWith(this.inputValue.toLowerCase())); 
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
    if (!this.accountSelected?.some(item => item.name === this.filteredAccounts[i].name)) {
      this.accountSelected!.push(this.filteredAccounts[i]);
      this.inputValue = '';
    }
    if (this.accountSelected.length > 0) {
      this.isDisabled = false;
      this.selectContactsChecked =true;
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
    let channel = { name: this.devspaceService.channelsName, description: this.devspaceService.channelsDescription, channelActiveTalk: false };
    this.devspaceService.channels.push(channel);
    if(this.allContactsChecked){
      const contactsAll = this.devspaceService.accounts.map(account => account.name);
      console.log(contactsAll);      
    }

    if(this.selectContactsChecked){ 
      const contactsSelect = this.accountSelected.map(account => account.name);
      console.log(contactsSelect);
    }
           
    this.dialog.closeAll();
  }
}
