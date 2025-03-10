import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceService } from '../../../shared/Service/devspace.service';
import { FormsModule } from '@angular/forms'; // Importieren!
import { DevspaceAccount } from '../../../shared/interface/devspace-account';

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

  constructor(private dialog: MatDialog, public devspaceService: DevspaceService) {
    this.accounts = this.devspaceService.accounts;
    this.accountSelected = [];
    console.log(this.accountSelected);

  }

  ngOnInit(): void {
    this.lastChannel = this.devspaceService.channels[this.devspaceService.channels.length - 1];

  }

  get filteredAccounts(): DevspaceAccount[] {
    return this.accounts
      .filter(account => account.name.toLowerCase().startsWith(this.inputValue.toLowerCase()));  // Filtert das ganze Objekt basierend auf der Eingabe
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
          }
        }
      }
    });

    if (!isChecked) {
      this.selectedCheckbox = null;
    }

    

    this.openSelect = isSelectedContactsChecked;
    this.updateButtonState();
  }

  updateButtonState() {
    if (!this.selectedCheckbox ) {
      this.isDisabled = true;
      return;
    }
  
    if (this.openSelect) {
      this.isDisabled = this.inputValue.trim() === '';
      this.openSelectContact = false;     
    } else {
      this.isDisabled = false;
    }
  }

  selectContact(i: number) {
     
    if (!this.accountSelected?.some(item => item.name === this.filteredAccounts[i].name)) {
      this.accountSelected!.push(this.filteredAccounts[i]);
      this.inputValue = '';   
    }
    console.log(this.accountSelected);
  }

  removeContact(i: number) {
    this.accountSelected.splice(i,1);
    if(this.accountSelected.length > 0){
      this.isDisabled = true;
    }else{
      this.isDisabled = false;
    }
  }

  SelectContact() {
    this.openSelectContact = true;
    this.inputValue = '';
  }

  SelectContactClose(){
    this.openSelectContact = false;
    
  }
}
