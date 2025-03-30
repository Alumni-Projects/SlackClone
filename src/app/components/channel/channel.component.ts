import { Component, OnInit } from '@angular/core';
import { MessageInputAreaComponent } from "../message-input-area/message-input-area.component";
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { MatDialog } from '@angular/material/dialog';
import { EditChannelDialogComponent } from './edit-channel-dialog/edit-channel-dialog.component';
import { MemberChannelDialogComponent } from './member-channel-dialog/member-channel-dialog.component';

@Component({
  selector: 'app-channel',
  imports: [MessageInputAreaComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent implements OnInit {
  constructor(public devspaceService: DevspaceService, public dialog: MatDialog) { }
  filterChannel: any[] = [];
ngOnInit(): void {  
  this.filterChannel = this.devspaceService.channels.filter(channel => channel.channelActiveTalk == true);   
}

openEditChannelDialog() {    
  this.dialog.open(EditChannelDialogComponent, {
    position: { top: '200px' }
  });
}

openContactChannel() {
  this.dialog.open(MemberChannelDialogComponent);
}

}
