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
  constructor(public dialog: MatDialog, public devspaceService: DevspaceService, public firestore: FirestoreService, private cdr: ChangeDetectorRef) { }
  filterChannel: any[] = [];
  filterCreator: any[] = [];
  private subscriptions: Subscription = new Subscription();
  editChannelName: boolean = true;
  editChannelDescription: boolean = true;
  charsLeft: number = 20;
  channelNameInputError: boolean = false;
  charsOver: boolean = false;
  charsEmpty: boolean = false;
  @ViewChild('channelInput') channelInput!: ElementRef;
  @ViewChild('channelDescriptionInput') channelDescriptionInput!: ElementRef;
  ngOnInit(): void {
    // Abo für das channels Observable
    this.subscriptions = this.firestore.channels$.subscribe(channels => {      
        this.filterChannel = channels.filter(
          channel => this.devspaceService.selectedChannelId == channel.id
        );
      console.log('Aktualisierte Channels:', this.filterChannel);
      this.updateCreator();
    }); 
    
  }

  private updateCreator() {
    if (this.filterChannel.length > 0) {
      // Hier wird überprüft, ob der Creator des Channels korrekt ist
      this.filterCreator = this.devspaceService.accounts.filter(
        member => member.uid === this.filterChannel[0].creator
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Aufräumen der Subscription
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

  chars() {
    this.charsLeft = 20 - this.channelInput.nativeElement.value.length;
    this.channelNameInputError = this.channelInput.nativeElement.value.length === 20
    if (this.channelNameInputError) {
      this.charsOver = true;
    }
  }


}
