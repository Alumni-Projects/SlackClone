import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-edit-channel-dialog',
  imports: [],
  templateUrl: './edit-channel-dialog.component.html',
  styleUrl: './edit-channel-dialog.component.scss'
})
export class EditChannelDialogComponent implements OnInit {
  constructor(public dialog: MatDialog, public devspaceService: DevspaceService) { }
  filterChannel: any[] = [];
  editChannelName: boolean = true;
  editChannelDescription: boolean = true;
  charsLeft: number = 20;
  channelNameInputError: boolean = false;
  charsOver: boolean = false;
  charsEmpty: boolean = false;
  @ViewChild('channelInput') channelInput!: ElementRef;
  @ViewChild('channelDescriptionInput') channelDescriptionInput!: ElementRef;
  ngOnInit(): void {
    this.filterChannel = this.devspaceService.channels.filter(channel => channel.channelActiveTalk == true);
    console.log(this.filterChannel);

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
      this.filterChannel[0].name = this.channelInput.nativeElement.value;
    }
  }

  saveChannelDescription() {
    this.editChannelDescription = true;
    this.filterChannel[0].description = this.channelDescriptionInput.nativeElement.value;
  }

  chars() {
    this.charsLeft = 20 - this.channelInput.nativeElement.value.length;
    this.channelNameInputError = this.channelInput.nativeElement.value.length === 20
    if (this.channelNameInputError) {
      this.charsOver = true;
    }
  }

  
}
