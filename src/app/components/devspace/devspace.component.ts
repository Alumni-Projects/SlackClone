import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceDialogComponent } from './devspace-dialog/devspace-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceService } from '../../shared/Service/devspace.service';




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

  constructor(public dialog: MatDialog, public devspaceService: DevspaceService) { }

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


  }
  openMessage() {
    this.devspaceService.accounts.forEach((account,) => {
      account.activeMessage = false;
    });
    this.devspaceService.channels.forEach((channel,) => {
      channel.channelActiveTalk = false;
    });
    this.devspaceService.openMessage = true;
  }

  closeMessage(){
    this.devspaceService.openMessage = false;
  }
}
