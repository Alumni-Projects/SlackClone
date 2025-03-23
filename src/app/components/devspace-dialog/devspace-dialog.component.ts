import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceDialogContactComponent } from '@components/devspace/devspace-dialog-contact/devspace-dialog-contact.component';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-devspace-dialog',
  imports: [],
  templateUrl: './devspace-dialog.component.html',
  styleUrl: './devspace-dialog.component.scss'
})
export class DevspaceDialogComponent {
  @ViewChild('channelInput') channelInput!: ElementRef;
  @ViewChild('channelDescription') channelDescription!: ElementRef;
  channelInputError: boolean = false;
  charsLeft: number = 20;



  constructor(private dialog: MatDialog, public devspaceService: DevspaceService, public breakpoints: BreakpointsService) { }

  closeDialog() {
    this.dialog.closeAll();
  }
  createChannel() {
    this.devspaceService.channelsName = this.channelInput.nativeElement.value;
    this.devspaceService.channelsDescription = this.channelDescription.nativeElement.value;
    this.dialog.closeAll();
    this.openDialog();
  }

  openDialog() {
    this.dialog.open(DevspaceDialogContactComponent);
  }

  chars(){
    this.charsLeft = 20 - this.channelInput.nativeElement.value.length;
    this.channelInputError = this.channelInput.nativeElement.value.length === 20;
  }
}
