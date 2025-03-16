import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceService } from '../../shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-devspace-dialog',
  imports: [],
  templateUrl: './devspace-dialog.component.html',
  styleUrl: './devspace-dialog.component.scss'
})
export class DevspaceDialogComponent {
  @ViewChild('channelInput') channelInput!: ElementRef;
  @ViewChild('channelDescription') channelDescription!: ElementRef;


  constructor(private dialog: MatDialog, public devspaceService: DevspaceService) { }

  closeDialog() {
    this.dialog.closeAll();
  }
  createChannel() {
    this.devspaceService.channelsName = this.channelInput.nativeElement.value;
    this.devspaceService.channelsDescription = this.channelDescription.nativeElement.value;
    let channel = { name: this.devspaceService.channelsName, description: this.devspaceService.channelsDescription, channelActiveTalk: false };
    this.devspaceService.channels.push(channel);
    this.dialog.closeAll();
  }
}
