import { Component,ViewChild, ElementRef } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { DevspaceService } from '../../../shared/Service/devspace.service';
import { DevspaceDialogContactComponent } from '../devspace-dialog-contact/devspace-dialog-contact.component';

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

  closeDialog(){
    this.dialog.closeAll();
  }
  createChannel(){
    this.devspaceService.channelsName = this.channelInput.nativeElement.value;
    this.devspaceService.channelsDescription = this.channelDescription.nativeElement.value; 
    let channel = {name: this.devspaceService.channelsName, description: this.devspaceService.channelsDescription, channelActiveTalk: false};
    this.devspaceService.channels.push(channel);   
    
    this.dialog.closeAll();
    this.openDialog();
  }

  openDialog() {
    this.dialog.open(DevspaceDialogContactComponent);
  }
}
