import { Component, ElementRef, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { DevspaceService } from '../../shared/Service/devspace.service';
import { FormsModule } from '@angular/forms';  //


@Component({
  selector: 'app-devspace-message',
  imports: [FormsModule],
  templateUrl: './devspace-message.component.html',
  styleUrl: './devspace-message.component.scss'
})
export class DevspaceMessageComponent {
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messageTitle') messageTitle!: ElementRef;
  openSmileyBar = false;
  openContactBar = false;
  openChannelBar = false;
  openContactBarSearch = false;
  openChannelBarSearch = false;
  messageText: string = '';

  constructor(public devspaceService: DevspaceService, private cdRef: ChangeDetectorRef) { }
  selectSmiley(i: number) {
    const emoji = this.devspaceService.emojis[i];
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus();
    const selection = window.getSelection();
    const range = document.createRange();

    if (!messageDiv.textContent?.trim()) {
      messageDiv.innerHTML = "";
    }

    range.selectNodeContents(messageDiv);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    this.openSmileyBar = false;
    this.cdRef.detectChanges();
  }
  openAt() {
    const at = '@';
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus();
    const selection = window.getSelection();
    const range = document.createRange();

    if (!messageDiv.textContent?.trim()) {
      messageDiv.innerHTML = "";
    }

    range.selectNodeContents(messageDiv);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    const textNode = document.createTextNode(at);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    this.cdRef.detectChanges();
    this.openContactBar = true;
  }


  selectContact(i: number) {
    this.openContactBar = false;
    const contactName = this.devspaceService.accounts[i].name;
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus();
    const selection = window.getSelection();
    const range = document.createRange();


    if (!selection || selection.rangeCount === 0 || selection.anchorNode !== messageDiv) {

      if (messageDiv.childNodes.length === 0) {
        range.setStart(messageDiv, 0);
        range.setEnd(messageDiv, 0);
      } else {

        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {

      range.setStart(selection.anchorNode, selection.anchorOffset);
      range.setEnd(selection.anchorNode, selection.anchorOffset);
    }

    range.deleteContents();
    const textNode = document.createTextNode(contactName);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection?.removeAllRanges();
    selection?.addRange(range);
    this.cdRef.detectChanges();

  }

  ngAfterViewInit() {
    this.messageInput.nativeElement.addEventListener('input', () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";

      if (textBeforeCursor.endsWith("@")) {

        this.openContactBar = true;
      } else {
        this.openContactBar = false;
      }

      if (textBeforeCursor.endsWith("#")) {

        this.openChannelBar = true;
      } else {
        this.openChannelBar = false;
      }
    });
  }

  openSmiley() {
    this.openSmileyBar = !this.openSmileyBar;
    this.openContactBar = false;
    this.openChannelBar = false;
  }

  closeBars() {
    this.openSmileyBar = false;
    this.openContactBar = false;
    this.openChannelBar = false;
  }
  selectChannel(i: number) {
    this.openChannelBar = false;
    const channelName = this.devspaceService.channels[i].name;
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus();
    const selection = window.getSelection();
    const range = document.createRange();

    if (!selection || selection.rangeCount === 0 || selection.anchorNode !== messageDiv) {

      if (messageDiv.childNodes.length === 0) {
        range.setStart(messageDiv, 0);
        range.setEnd(messageDiv, 0);
      } else {

        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {

      range.setStart(selection.anchorNode, selection.anchorOffset);
      range.setEnd(selection.anchorNode, selection.anchorOffset);
    }

    range.deleteContents();
    const textNode = document.createTextNode(channelName);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection?.removeAllRanges();
    selection?.addRange(range);
    this.cdRef.detectChanges();
  }

  addMessage() {
    const message = this.messageInput.nativeElement.textContent;
    console.log(message);

    // this.messageInput.nativeElement.textContent = "";
    // this.openSmileyBar = false;
    // this.openContactBar = false;
    // this.openChannelBar = false;
  }

  onInputChange(value: string) {
    const lastAtIndex = value.lastIndexOf('@');
    const lastHashIndex = value.lastIndexOf('#');

    if (lastAtIndex !== -1 && value.slice(lastAtIndex + 1).trim() === '') {
      this.openContactBarSearch = true;
    } else {
      this.openContactBarSearch = false;
    }
    if (lastHashIndex !== -1 && value.slice(lastHashIndex + 1).trim() === '') {
      this.openChannelBarSearch = true;
    } else {
      this.openChannelBarSearch = false;
    }
  }

  selectContactSearch(i: number) {
    const contactName = this.devspaceService.accounts[i].name;
    const lastAtIndex = this.messageText.lastIndexOf('@');

    if (this.messageText.includes(contactName)) {
      return;
    }

    if (lastAtIndex !== -1) {

      this.messageText =
        this.messageText.substring(0, lastAtIndex + 1) +
        contactName + ' ' +
        this.messageText.substring(lastAtIndex + 1).replace(/^\S*/, '');

      this.openChannelBarSearch = false;
      this.openContactBarSearch = false;
      this.messageTitle.nativeElement.focus();
    }
  }

  selectChannelSearch(i: number) {
    const channelName = this.devspaceService.channels[i].name;
    const lastAtIndex = this.messageText.lastIndexOf('#');

    if (this.messageText.includes(channelName)) {
      return;

    }

    if (lastAtIndex !== -1) {
      this.messageText =
        this.messageText.substring(0, lastAtIndex + 1) +
        channelName + ' ' +
        this.messageText.substring(lastAtIndex + 1).replace(/^\S*/, '');

      this.openChannelBarSearch = false;
      this.openContactBarSearch = false;
      this.messageTitle.nativeElement.focus();
    }
  }

}
