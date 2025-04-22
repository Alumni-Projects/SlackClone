import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';


@Component({
  selector: 'app-message-input-area',
  imports: [],
  templateUrl: './message-input-area.component.html',
  styleUrl: './message-input-area.component.scss'
})
export class MessageInputAreaComponent {
  @ViewChild('messageInput') messageInput!: ElementRef;
  @Input() context!: 'message' | 'channel' | 'thread' | 'directmessage';
  constructor(public devspaceService: DevspaceService, private cdRef: ChangeDetectorRef, public firestore: FirestoreService) {
  }


  ngAfterViewInit(): void {
    this.inputSearchMessages();
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
    this.devspaceService.openSmileyBar = false;
    this.cdRef.detectChanges();
  }
  openAt() {
    this.devspaceService.openSmileyBar = false;
    this.devspaceService.openContactBar = true;
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
    this.devspaceService.barContext = this.context;
  }
  selectContact(i: number) {
    this.devspaceService.openContactBar = false;
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
    const contactName = this.devspaceService.accounts[i].displayName;
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
    if (this.devspaceService.barContext !== this.context) {
      this.devspaceService.openSmileyBar = false;
      this.devspaceService.openContactBar = false;
      this.devspaceService.openChannelBar = false;
      this.devspaceService.channelMember = false;
      this.devspaceService.channelMemberAdded = false;
    }
    this.devspaceService.openSmileyBar = true;
    this.devspaceService.openContactBar = false;
    this.devspaceService.openChannelBar = false;
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
    this.devspaceService.barContext = this.context;
  }

  closeBars() {
    this.devspaceService.openSmileyBar = false;
    this.devspaceService.openContactBar = false;
    this.devspaceService.openChannelBar = false;
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
  }
  selectChannel(i: number) {
    this.devspaceService.openChannelBar = false;
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
    const channelsName = this.devspaceService.channels[i].title;
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
    switch (this.context) {
      case 'message':
        this.sortDataFromMessage();
        break;
      case 'channel':
        this.sortDataFromChannel();
        break;
      case 'thread':
        this.sortDataFromThread();
        break;
      case 'directmessage':
        this.sortDataFromDirectMessage();
        break;
    }
    this.clearInputFieldMessage();
    this.closeBarsAll();

  }

  closeBarsAll() {
    this.devspaceService.openChannelBarSearch = false;
    this.devspaceService.openContactBarSearch = false;
    this.devspaceService.openSmileyBar = false;
    this.devspaceService.openContactBar = false;
    this.devspaceService.openChannelBar = false;
    this.devspaceService.channelMember = false;
    this.devspaceService.channelMemberAdded = false;
  }

  sortDataFromMessage() {
    const message = this.messageInput.nativeElement.textContent;
    const channels = this.channelNameMessage();
    const contacts = this.contactNameMessage();
    this.devspaceService.contactArray.subscribe((contacts) => {

    });

    this.devspaceService.channelArray.subscribe((channels) => {

    });
  }

  sortDataFromChannel() {
    const message = this.messageInput.nativeElement.textContent;
    // const channels = this.channelNameMessage();
    // const contacts = this.contactNameMessage();
    const channelId = this.devspaceService.selectedChannelId!;
    const creatorId = this.devspaceService.loggedInUserUid;
    this.firestore.addMessageToChannel(channelId, message, creatorId);
  }

  sortDataFromThread(): void {
    const message = this.messageInput.nativeElement.textContent;
    const channelId = this.devspaceService.selectedChannelId!;
    const parentId = this.firestore.selectedThreadMessage?.id;
    const creatorId = this.devspaceService.loggedInUserUid!;

    if (parentId) {
      this.firestore.addThreadMessage(channelId, parentId, message, creatorId);
    } else {
      console.error('No parentId found. Cannot add thread message.');
    }
  }

  sortDataFromDirectMessage() {
    const message = this.messageInput.nativeElement.textContent;
    const channels = this.channelNameMessage();
    const contacts = this.contactNameMessage();

  }

  clearInputFieldMessage() {
    this.messageInput.nativeElement.textContent = "";
    this.clearDiv();
  }

  clearDiv() {
    this.devspaceService.setClearInputMessage(true);
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
      const container = range.startContainer;
      let textBeforeCursor = "";
      if (container.nodeType === Node.TEXT_NODE) {
        textBeforeCursor = container.textContent?.slice(0, range.startOffset) || "";
      } else if (container.nodeType === Node.ELEMENT_NODE) {
        textBeforeCursor = container.textContent || "";
      }

      if (textBeforeCursor.endsWith("@")) {
        this.devspaceService.channelMember = false;
        this.devspaceService.channelMemberAdded = false;
        this.devspaceService.openContactBar = true;
        this.devspaceService.openChannelBar = false;
        this.devspaceService.barContext = this.context;
      } else if (this.devspaceService.barContext === this.context) {
        this.devspaceService.openContactBar = false;
      }

      if (textBeforeCursor.endsWith("#")) {
        this.devspaceService.channelMember = false;
        this.devspaceService.channelMemberAdded = false;
        this.devspaceService.openChannelBar = true;
        this.devspaceService.openContactBar = false;
        this.devspaceService.barContext = this.context;
      } else if (this.devspaceService.barContext === this.context) {
        this.devspaceService.openChannelBar = false;
      }
    });
  }


}
