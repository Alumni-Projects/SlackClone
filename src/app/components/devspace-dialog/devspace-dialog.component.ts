import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DevspaceDialogContactComponent } from '@components/devspace/devspace-dialog-contact/devspace-dialog-contact.component';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-devspace-dialog',
  imports: [],
  templateUrl: './devspace-dialog.component.html',
  styleUrl: './devspace-dialog.component.scss'
})
export class DevspaceDialogComponent {
  @ViewChild('channelInput') channelInput!: ElementRef;
  @ViewChild('channelDescription') channelDescription!: ElementRef;
  channelInputError = false;
  charsLeft: number = 20;
  charsOver = false;
  charsEmpty = false



  constructor(private dialog: MatDialog, public devspaceService: DevspaceService, public breakpoints: BreakpointsService, @Inject(MAT_DIALOG_DATA) public data: any, public firestore: FirestoreService) { }

  closeDialog() {
    this.dialog.closeAll();    
  }
  async createChannel() {
    if (this.devspaceService.createNewChannel) {
      if (this.channelInput.nativeElement.value.length === 0) {
        this.charsEmpty = true;
        this.charsOver = false;
        this.channelInputError = true;
      } else {
        this.devspaceService.channelsName = this.channelInput.nativeElement.value;
        this.devspaceService.channelsDescription = this.channelDescription.nativeElement.value;
        this.dialog.closeAll();
        this.openDialog();
      }
    } else if (this.devspaceService.createNewChannelFromNewMessage) {
      if (this.channelInput.nativeElement.value.length === 0) {
        this.charsEmpty = true;
        this.charsOver = false;
        this.channelInputError = true;
      } else {
        this.devspaceService.channelsName = this.channelInput.nativeElement.value;
        this.devspaceService.channelsDescription = this.channelDescription.nativeElement.value;
        const timestamp = new Date().toISOString();
        const baseChannel = {
          title: this.devspaceService.channelsName,
          description: this.devspaceService.channelsDescription,
          creator: this.devspaceService.loggedInUserUid,
          createdAt: timestamp
        };
        const selectedUids = this.data.contact
          .map((a: DevspaceAccount) => a.uid)
          .filter((uid: string) => uid !== this.devspaceService.loggedInUserUid);
        await this.firestore.saveChannelToFirestore({
          ...baseChannel,
          member: [...selectedUids, this.devspaceService.loggedInUserUid]
        });
        const last = this.firestore.lastAddedChannel;
        await this.firestore.addMessageToChannel(last!.id!, this.data.message, this.devspaceService.loggedInUserUid);        
        this.activateLastCreatedChannel();
        this.dialog.closeAll();
      }

    }

  }

  openDialog() {
    this.dialog.open(DevspaceDialogContactComponent);
  }

  maxCharsInputControll() {
    this.charsLeft = 20 - this.channelInput.nativeElement.value.length;
    this.channelInputError = this.channelInput.nativeElement.value.length === 20;
    if (this.channelInputError) {
      this.charsOver = true;
    }
  }

  activateLastCreatedChannel(): void {
    const last = this.firestore.lastAddedChannel;
    this.devspaceService.selectedChannelId = last?.id || '';
    this.devspaceService.openChannel = true;
    if(this.breakpoints.breankpointMain){
      this.devspaceService.openDevspace = false;      
    }
  }
}
