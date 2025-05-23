import { Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DevspaceDialogComponent } from '@components/devspace-dialog/devspace-dialog.component';
import { Devspace } from '@shared/interface/devspace';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
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
  constructor(public devspaceService: DevspaceService, private cdRef: ChangeDetectorRef,
    public firestore: FirestoreService,
    public dialog: MatDialog,
    public breakpoints: BreakpointsService) {
  }


  ngAfterViewInit(): void {
    this.inputSearchMessages();
    this.devspaceService.contactArray.subscribe((contacts) => {
    });
    this.devspaceService.channelArray.subscribe((channels) => {
    });
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
        this.SendMessageFromNewMessage();
        break;
      case 'channel':
        this.SendMessageFromChannel();
        break;
      case 'thread':
        this.SendMessageFromThread();
        break;
      case 'directmessage':
        this.SendMessageFromDirectMessage();
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

  async SendMessageFromNewMessage() {
    const message = this.messageInput.nativeElement.textContent.trim();
    if (!message) return;
    const channel = this.filterChannelFromNewMessage(this.devspaceService.channelArray.value);
    const contact = this.filterContactFromNewMessage(this.devspaceService.contactArray.value);
    const creatorId = this.devspaceService.loggedInUserUid;
    const sendMessageUserData = this.devspaceService.sendMessageUserData$.getValue();
    if (channel.length > 0) {
      for (let i = 0; i < channel.length; i++) {
        this.firestore.addMessageToChannel(channel[i]!.id!, message, creatorId);
      }
    }

    if (sendMessageUserData != null && contact.length == 0) {
      const dmId = await this.firestore.checkAndCreateDirectMessage(sendMessageUserData!.uid!, creatorId);
      this.firestore.addMessageToDirectMessage(dmId, message, creatorId);
      

    } else if (contact.length == 1) {
      for (let i = 0; i < contact.length; i++) {
        const dmId = await this.firestore.checkAndCreateDirectMessage(contact[i]!.uid!, creatorId);
        this.firestore.addMessageToDirectMessage(dmId, message, creatorId);
      }
    } else if (contact.length > 1) {
      this.devspaceService.createNewChannel = false;
      this.devspaceService.createNewChannelFromNewMessage = true;
      this.dialog.open(DevspaceDialogComponent, {
        data: {
          contact: contact,
          message: message
        }
      })
    }
    this.devspaceService.openMessage = false;
    

    if (this.breakpoints.breankpointMain) {
      this.devspaceService.openDevspace = true;
    }
    this.devspaceService.sendMessageUser$.next(null);
    this.devspaceService.sendMessageUserData$.next(null);
    this.devspaceService.dmAccounts = await this.firestore.findDmUsers(this.devspaceService.loggedInUserUid);

  }

  filterChannelFromNewMessage(channelSelected: Devspace[]) {
    const selectChannel = [];
    for (let i = 0; i < channelSelected.length; i++) {
      const channel = this.devspaceService.channels.find(channel => channel.title == channelSelected[i]);
      selectChannel.push(channel);
    }
    return selectChannel;
  }

  filterContactFromNewMessage(contactSelected: string[]) {
    const selectcontact = [];
    for (let i = 0; i < contactSelected.length; i++) {
      const contact = this.devspaceService.accounts.find(contact => contact.displayName == contactSelected[i]);
      selectcontact.push(contact);
    }
    return selectcontact;
  }

  SendMessageFromChannel() {
    const message = this.messageInput.nativeElement.textContent;
    const channelId = this.devspaceService.selectedChannelId!;
    const creatorId = this.devspaceService.loggedInUserUid;
    this.firestore.addMessageToChannel(channelId, message, creatorId);
  }

  SendMessageFromThread(): void {
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

  SendMessageFromDirectMessage() {
    const message = this.messageInput.nativeElement.textContent;
    const creatorId = this.devspaceService.loggedInUserUid!;
    const contactId = this.devspaceService.selectContactDmId!;
    const dmId = this.devspaceService.contactDmId;
    this.firestore.addMessageToDM(dmId!, message, creatorId);


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
