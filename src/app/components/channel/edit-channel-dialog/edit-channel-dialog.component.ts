import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-channel-dialog',
  imports: [],
  templateUrl: './edit-channel-dialog.component.html',
  styleUrl: './edit-channel-dialog.component.scss'
})
export class EditChannelDialogComponent implements OnInit {
  @ViewChild('channelInput') channelInput!: ElementRef;
  @ViewChild('channelDescriptionInput') channelDescriptionInput!: ElementRef;
  filterChannel: any[] = [];
  filterCreator: any[] = [];
  private subscriptions: Subscription = new Subscription();
  editChannelName = true;
  editChannelDescription = true;
  charsLeft = 20;
  channelNameInputError = false;
  charsOver = false;
  charsEmpty = false;
  constructor(public dialog: MatDialog, public devspaceService: DevspaceService, public firestore: FirestoreService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.subscriptions = this.firestore.channels$.subscribe(channels => {
      this.filterChannel = channels.filter(
        channel => this.devspaceService.selectedChannelId == channel.id
      );      
      this.updateCreator();
    });

  }

  private updateCreator() {
    if (this.filterChannel.length > 0) {
      this.filterCreator = this.devspaceService.accounts.filter(
        member => member.uid === this.filterChannel[0].creator
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  saveChannelName() {
    if (this.channelInput.nativeElement.value.length === 0) {
      this.charsEmpty = true;
      this.charsOver = false;
      this.channelNameInputError = true;
    } else {
      this.editChannelName = true;
      const channelid = this.filterChannel[0].id;
      const title = { title: this.channelInput.nativeElement.value }
      this.firestore.updateChannelEditInFirestore(channelid, title);
    }

  }

  saveChannelDescription() {
    this.editChannelDescription = true;
    const channelid = this.filterChannel[0].id;
    const description = { description: this.channelDescriptionInput.nativeElement.value }
    this.firestore.updateChannelEditInFirestore(channelid, description);

  }

  maxCharsInputControll() {
    this.charsLeft = 20 - this.channelInput.nativeElement.value.length;
    this.channelNameInputError = this.channelInput.nativeElement.value.length === 20
    if (this.channelNameInputError) {
      this.charsOver = true;
    }
  }

  leaveChannel() {
    const channelid = this.filterChannel[0].id;
    if (this.filterChannel[0].creator == this.devspaceService.loggedInUserUid) {
      this.firestore.deleteChannelFromFirestore(channelid);
      this.devspaceService.openChannel = false;
      this.devspaceService.selectedChannelId = '';
    } else {
      this.devspaceService.selectedChannelId = '';
      this.devspaceService.openChannel = false;
      setTimeout(() => {
        this.firestore.deleteChannelMemberFromFirestore(channelid, this.devspaceService.loggedInUserUid);
      }, 100)
    }
    this.closeDialog();
  }

}
