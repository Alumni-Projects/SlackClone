import { query } from '@angular/animations';
import { Component, ElementRef, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-devspace-message',
  imports: [FormsModule],
  templateUrl: './devspace-message.component.html',
  styleUrl: './devspace-message.component.scss'
})
export class DevspaceMessageComponent {
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messageTitle') messageTitle!: ElementRef;
  @ViewChild('addInput') addInput!: ElementRef;
  openSmileyBar = false;
  openContactBar = false;
  openChannelBar = false;
  openContactBarSearch = false;
  openChannelBarSearch = false;
  messageText: string = '';

  constructor(public devspaceService: DevspaceService, private cdRef: ChangeDetectorRef) {

  }
  checkPlaceholder() {
    const div = this.addInput.nativeElement;
    if (!div.textContent?.trim()) {
      div.classList.add('placeholder-active');
    } else {
      div.classList.remove('placeholder-active');
    }
  }

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
    this.openSmileyBar = false;
    this.openContactBar = true;
  }



  selectContact(i: number) {
    this.openContactBar = false;
    const contactName = this.devspaceService.accounts[i].name;
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (messageDiv.textContent?.trim() === "") {
      range.setStart(messageDiv, 0);
      range.setEnd(messageDiv, 0);
    } else {
      const lastChild = messageDiv.lastChild;
      if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(lastChild, lastChild.textContent?.length || 0);
        range.setEnd(lastChild, lastChild.textContent?.length || 0);
      } else {
        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
    }
    range.deleteContents();
    const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";
    if (textBeforeCursor.endsWith("@")) {
      const updatedText = textBeforeCursor.slice(0, -1);
      range.startContainer.textContent = updatedText + range.startContainer.textContent?.slice(range.startOffset);
      range.setStart(range.startContainer, updatedText.length);
      range.setEnd(range.startContainer, updatedText.length);
    }
    const nameToInsert = '@' + contactName;
    const span = document.createElement('span');
    span.classList.add('contact');
    span.style.color = 'var(--mail-blue)';
    span.textContent = nameToInsert;
    span.contentEditable = "false";
    span.dataset['contact'] = "true";
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    this.cdRef.detectChanges();
    messageDiv.focus();
  }

  ngAfterViewInit() {
    this.checkPlaceholder();
    this.inputSearchMessages();
    this.inputSearchAddMessage();
  }

  inputSearchMessages() {
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

  inputSearchAddMessage() {
    this.addInput.nativeElement.addEventListener('input', () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";
      if (textBeforeCursor.endsWith("@")) {
        this.openContactBarSearch = true;
      } else {
        this.openContactBarSearch = false;
      }

      if (textBeforeCursor.endsWith("#")) {
        this.openChannelBarSearch = true;
      } else {
        this.openChannelBarSearch = false;
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
    const channelsName = this.devspaceService.channels[i].name;
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (messageDiv.textContent?.trim() === "") {
      range.setStart(messageDiv, 0);
      range.setEnd(messageDiv, 0);
    } else {
      const lastChild = messageDiv.lastChild;
      if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(lastChild, lastChild.textContent?.length || 0);
        range.setEnd(lastChild, lastChild.textContent?.length || 0);
      } else {
        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
    }
    range.deleteContents();
    const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";
    if (textBeforeCursor.endsWith("#")) {
      const updatedText = textBeforeCursor.slice(0, -1);
      range.startContainer.textContent = updatedText + range.startContainer.textContent?.slice(range.startOffset);
      range.setStart(range.startContainer, updatedText.length);
      range.setEnd(range.startContainer, updatedText.length);
    }
    const nameToInsert = '#' + channelsName;
    const span = document.createElement('span');
    span.classList.add('channel');
    span.style.color = 'var(--secondary-color)';
    span.textContent = nameToInsert;
    span.contentEditable = "false";
    span.dataset['channel'] = "true";
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    this.cdRef.detectChanges();
  }

  addMessage() {
    const message = this.messageInput.nativeElement.textContent;
    console.log(message);
    debugger
    const channels = this.channelNameMessage();
    const contacts = this.contactNameMessage();
    const channelInput = this.channelNameInput();
    const contactInput = this.contactNameInput();
    console.log(channels, contacts, channelInput, contactInput);


    this.messageInput.nativeElement.textContent = "";
    this.addInput.nativeElement.textContent = "";
    this.openChannelBarSearch = false;
    this.openContactBarSearch = false;
    this.openSmileyBar = false;
    this.openContactBar = false;
    this.openChannelBar = false;
  }

  contactNameMessage() {
    const contacts = this.messageInput.nativeElement.querySelectorAll('span[data-contact="true"]');
    const contactArray: any[] = [];
    contacts?.forEach((span: HTMLElement) => {
      const contactName = span.textContent?.slice(1);
      contactArray.push(contactName);
    });
    const sortContacts = [...new Set(contactArray)];
    return sortContacts;
  }

  contactNameInput() {
    const contacts = this.addInput.nativeElement.querySelectorAll('span[data-contact-Input="true"]');
    const contactArray: any[] = [];
    contacts?.forEach((span: HTMLElement) => {
      const contactName = span.textContent?.slice(1);
      contactArray.push(contactName);
    });
    const sortContacts = [...new Set(contactArray)];
    return sortContacts;
  }

  channelNameMessage() {
    const channels = this.messageInput.nativeElement.querySelectorAll('span[data-channel="true"]');
    const channelArray: any[] = [];
    channels?.forEach((span: HTMLElement) => {
      const channelName = span.textContent?.slice(1);
      channelArray.push(channelName);
    });
    const sortChannels = [...new Set(channelArray)];
    return sortChannels;
  }

  channelNameInput() {
    const channels = this.addInput.nativeElement.querySelectorAll('span[data-channel-Input="true"]');
    const channelArray: any[] = [];
    channels?.forEach((span: HTMLElement) => {
      const channelName = span.textContent?.slice(1);
      channelArray.push(channelName);
    });
    const sortChannels = [...new Set(channelArray)];
    return sortChannels;
  }

  selectContactSearch(i: number) {
    this.openContactBarSearch = false;
    const contactName = this.devspaceService.accounts[i].name;
    const messageDiv = this.addInput.nativeElement as HTMLDivElement;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const existingContacts = messageDiv.querySelectorAll('span[data-contact-Input="true"]');
    for (const contact of existingContacts) {
      if (contact.textContent === "@" + contactName) {
        range.collapse(false);
        return;
      }
    }
    if (messageDiv.textContent?.trim() === "") {
      range.setStart(messageDiv, 0);
      range.setEnd(messageDiv, 0);
    } else {
      const lastChild = messageDiv.lastChild;
      if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(lastChild, lastChild.textContent?.length || 0);
        range.setEnd(lastChild, lastChild.textContent?.length || 0);
      } else {
        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
    }
    range.deleteContents();
    const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";
    if (textBeforeCursor.endsWith("@")) {
      const updatedText = textBeforeCursor.slice(0, -1);
      range.startContainer.textContent = updatedText + range.startContainer.textContent?.slice(range.startOffset);
      range.setStart(range.startContainer, updatedText.length);
      range.setEnd(range.startContainer, updatedText.length);
    }
    const nameToInsert = '@' + contactName;
    const span = document.createElement('span');
    span.classList.add('contactInput');
    span.style.color = 'var(--mail-blue)';
    span.textContent = nameToInsert;
    span.contentEditable = "false";
    span.dataset['contactInput'] = "true";
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    this.cdRef.detectChanges();
  }




  selectChannelSearch(i: number) {   
    this.openChannelBarSearch = false;
    const channelName = this.devspaceService.channels[i].name;
    const messageDiv = this.addInput.nativeElement as HTMLDivElement;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const existingContacts = messageDiv.querySelectorAll('span[data-channel-Input="true"]');
    for (const contact of existingContacts) {
      if (contact.textContent === "#" + channelName) {
        range.collapse(false);
        
        return;
      }
    }
    if (messageDiv.textContent?.trim() === "") {
      range.setStart(messageDiv, 0);
      range.setEnd(messageDiv, 0);
    } else {
      const lastChild = messageDiv.lastChild;
      if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(lastChild, lastChild.textContent?.length || 0);
        range.setEnd(lastChild, lastChild.textContent?.length || 0);
      } else {
        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
    }
    range.deleteContents();
    const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";
    if (textBeforeCursor.endsWith("#")) {
      const updatedText = textBeforeCursor.slice(0, -1);
      range.startContainer.textContent = updatedText + range.startContainer.textContent?.slice(range.startOffset);
      range.setStart(range.startContainer, updatedText.length);
      range.setEnd(range.startContainer, updatedText.length);
    }
    const nameToInsert = '#' + channelName;
    const span = document.createElement('span');
    span.classList.add('channelInput');
    span.style.color = 'var(--purple-3)';
    span.textContent = nameToInsert;
    span.contentEditable = "false";
    span.dataset['channelInput'] = "true";
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    this.cdRef.detectChanges();
  }
}
