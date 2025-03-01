import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceDialogComponent } from './devspace-dialog/devspace-dialog.component';
import { MatDialog,MatDialogContent} from '@angular/material/dialog';

@Component({
  selector: 'app-devspace',
  imports: [   
  CommonModule,MatDialogContent],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss'
})
export class DevspaceComponent {
  activeChannel: boolean = false

  constructor(public dialog: MatDialog) { }

  channelActive() {
    this.activeChannel = !this.activeChannel;
  }

 

  openDialog() {
    this.dialog.open(DevspaceDialogComponent);
}


}
