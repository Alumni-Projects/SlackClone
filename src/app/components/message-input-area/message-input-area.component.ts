import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';

@Component({
  selector: 'app-message-input-area',
  imports: [],
  templateUrl: './message-input-area.component.html',
  styleUrl: './message-input-area.component.scss'
})
export class MessageInputAreaComponent {
  constructor( public devspaceService: DevspaceService, private cdRef: ChangeDetectorRef) { }
  @ViewChild('messageInput') messageInput!: ElementRef;
  
 
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
    this.devspaceService.openSmileyBar = false;
    this.cdRef.detectChanges();
  }
  openAt() {
    this.devspaceService.openSmileyBar = false;
    this.devspaceService.openContactBar = true;
  }
  selectContact(i: number) {
    this.devspaceService.openContactBar = false;
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
  openSmiley() {
    this.devspaceService.openSmileyBar = !this.devspaceService.openSmileyBar;
    this.devspaceService.openContactBar = false;
    this.devspaceService.openChannelBar = false;
  }

  closeBars() {
    this.devspaceService.openSmileyBar = false;
    this.devspaceService.openContactBar = false;
    this.devspaceService.openChannelBar = false;
  }
  selectChannel(i: number) {
    this.devspaceService.openChannelBar = false;
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
    const channels = this.channelNameMessage();
    const contacts = this.contactNameMessage();   
    console.log(channels, contacts,  message);


    this.messageInput.nativeElement.textContent = "";
    
    this.devspaceService.openChannelBarSearch = false;
    this.devspaceService.openContactBarSearch = false;
    this.devspaceService.openSmileyBar = false;
    this.devspaceService.openContactBar = false;
    this.devspaceService.openChannelBar = false;
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

  inputSearchMessages() {
    this.messageInput.nativeElement.addEventListener('input', () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";
      if (textBeforeCursor.endsWith("@")) {
        this.devspaceService.openContactBar = true;
        this.devspaceService.openContactBarSearch = false;
        this.devspaceService.openChannelBarSearch = false;
      }else{
        this.devspaceService.openContactBar = false;
      }

      if (textBeforeCursor.endsWith("#")) {
        this.devspaceService.openChannelBar = true;
        this.devspaceService.openContactBarSearch = false;
        this.devspaceService.openChannelBarSearch = false;
      } else {
        this.devspaceService.openChannelBar = false;
      }
    });
  }


}
