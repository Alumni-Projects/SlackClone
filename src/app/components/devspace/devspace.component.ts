import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceDialogComponent } from '../devspace-dialog/devspace-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { SearchbarComponent } from "../searchbar/searchbar.component";

@Component({
  selector: 'app-devspace',
  imports: [
    CommonModule,
    SearchbarComponent
],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss'
})
export class DevspaceComponent {
  activeChannel: boolean = false
  directMessages: boolean = false
  imagesLoaded = false;
  channelActiveTalk: boolean = false;
  breankpointHeader: boolean = false;
  activeDMContact: number | null = null;


  constructor(public dialog: MatDialog, public devspaceService: DevspaceService, public breakpoints: BreakpointsService, public firestore: FirestoreService) {

  }
  imageUrl = 'assets/img/arrow_drop_down.png';
  imageUrlMessage = 'assets/img/arrow_drop_down.png';


  channelActive() {
    this.activeChannel = !this.activeChannel;
    this.imageUrl = this.activeChannel
      ? 'assets/img/arrow_drop_down_right.png'
      : 'assets/img/arrow_drop_down.png';
  }

  messageActive() {
    this.directMessages = !this.directMessages;
    this.imageUrlMessage = this.directMessages
      ? 'assets/img/arrow_drop_down_right.png'
      : 'assets/img/arrow_drop_down.png';
  }



  openDialog() {
    this.devspaceService.createNewChannel = true;
    this.devspaceService.createNewChannelFromNewMessage = false;
    this.dialog.open(DevspaceDialogComponent);
  }
  channelActiveClass(channelId: string) {
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.selectedChannelId = channelId;
    this.devspaceService.openChannel = false;
    this.devspaceService.channelMember = false;
    this.devspaceService.activeDMContact = null;
    if(this.breakpoints.breankpointMain){
      this.devspaceService.openDevspace = false;     
    }
    setTimeout(() => {
      this.devspaceService.openChannel = true;
    }, 200);
  }

  messageActiveClass(i: number) {
    this.devspaceService.selectedChannelId = '';
    this.devspaceService.activeDMContact = i;
    this.devspaceService.openChannel = false;
    if(this.breakpoints.breankpointMain){
      this.devspaceService.openDevspace = false;     
    }
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.selectContactDmId = this.devspaceService.dmAccounts[i].userData.uid;
    this.devspaceService.contactDmId = this.devspaceService.dmAccounts[i].dmId;
    this.devspaceService.selectContactData = this.devspaceService.dmAccounts[i];
    this.firestore.subscribeToDirectMessage(this.devspaceService.loggedInUserUid, this.devspaceService.selectContactDmId!);
    setTimeout(() => {
      this.devspaceService.openDirectMessage = true;
    }, 200);

  }
  openMessage() {
    this.devspaceService.selectedChannelId = '';
    this.devspaceService.openMessage = true;
    this.devspaceService.openChannel = false;
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.openThread = false;
    this.devspaceService.activeDMContact = null;    
    if(this.breakpoints.breankpointMain){
      this.devspaceService.openDevspace = false;     
    }
  }

  closeMessage() {
    this.devspaceService.openMessage = false;
    this.devspaceService.openThread = false;
  }


}
