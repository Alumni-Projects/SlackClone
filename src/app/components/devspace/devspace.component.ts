import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceDialogComponent } from '../devspace-dialog/devspace-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';





@Component({
  selector: 'app-devspace',
  imports: [
    CommonModule,],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss'
})
export class DevspaceComponent implements OnInit {
  activeChannel: boolean = false
  directMessages: boolean = false
  imagesLoaded = false;
  channelActiveTalk: boolean = false;
  breankpointHeader: boolean = false

  constructor(public dialog: MatDialog, public devspaceService: DevspaceService, public breakpoints: BreakpointsService) {

  }



  imageUrl = '/assets/img/arrow_drop_down.png';
  imageUrlMessage = '/assets/img/arrow_drop_down.png';

  channelActive() {
    this.activeChannel = !this.activeChannel;
    this.imageUrl = this.activeChannel
      ? '/assets/img/arrow_drop_down_right.png'
      : '/assets/img/arrow_drop_down.png';
  }

  messageActive() {
    this.directMessages = !this.directMessages;
    this.imageUrlMessage = this.directMessages
      ? '/assets/img/arrow_drop_down_right.png'
      : '/assets/img/arrow_drop_down.png';
  }

  ngOnInit() {
    this.preloadImages().then(() => {
      this.imagesLoaded = true;
    });
  }

  preloadImages(): Promise<void> {
    const imageUrls = [
      '/assets/img/arrow_drop_down_right.png',
      '/assets/img/arrow_drop_down.png',
      '/assets/img/arrow_drop_down_right_hover.png',
      '/assets/img/arrow_drop_downHover.png',
      '/assets/img/account_circle.png',
      '/assets/img/account_circle_hover.png',
      '/assets/img/workspaces.png',
      '/assets/img/workspacesHover.png',

    ];

    return Promise.all(imageUrls.map(url => this.loadImage(url))).then(() => { });
  }

  loadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
    });
  }

  openDialog() {
    this.dialog.open(DevspaceDialogComponent);
  }
  channelActiveClass(i: number) {
    this.devspaceService.channels.forEach((channel,) => {
      channel.channelActiveTalk = false;
    });
    this.devspaceService.accounts.forEach((account,) => {
      account.activeMessage = false;
    });
    this.devspaceService.channels[i].channelActiveTalk = !this.devspaceService.channels[i].channelActiveTalk;


  }

  messageActiveClass(i: number) {

    this.devspaceService.accounts.forEach((account,) => {
      account.activeMessage = false;
    });
    this.devspaceService.channels.forEach((channel,) => {
      channel.channelActiveTalk = false;
    });
    this.devspaceService.accounts[i].activeMessage = !this.devspaceService.accounts[i].activeMessage;
    this.devspaceService.openChannel = false;
    this.devspaceService.openDirectMessage = true;


  }
  openMessage() {
    this.devspaceService.accounts.forEach((account,) => {
      account.activeMessage = false;
    });
    this.devspaceService.channels.forEach((channel,) => {
      channel.channelActiveTalk = false;
    });
    this.devspaceService.openMessage = true;
    this.devspaceService.openChannel = false;
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.openThread = false;
  }

  closeMessage() {
    this.devspaceService.openMessage = false;
  }

  openChannel(i: number) {
    this.devspaceService.accounts.forEach((account,) => {
      account.activeMessage = false;
    });
    this.devspaceService.channels.forEach((channel,) => {
      channel.channelActiveTalk = false;
    });
    this.devspaceService.openChannel = true;
    this.devspaceService.openDirectMessage = false;

  }
}
