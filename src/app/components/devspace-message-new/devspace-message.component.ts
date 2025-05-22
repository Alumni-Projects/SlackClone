
import { Component, ElementRef, ViewChild, ChangeDetectorRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageInputAreaComponent } from '@components/message-input-area/message-input-area.component';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-devspace-message',
  imports: [FormsModule, MessageInputAreaComponent],
  templateUrl: './devspace-message.component.html',
  styleUrl: './devspace-message.component.scss'
})
export class DevspaceMessageComponent implements OnDestroy {
  @ViewChild('addInput') addInput!: ElementRef;
  clearInputMessageSubscription!: Subscription;
  sendMessageUserSubscription?: Subscription;


  constructor(public devspaceService: DevspaceService, private cdRef: ChangeDetectorRef, private zone: NgZone,) {

  }



  ngOnDestroy() {
    this.sendMessageUserSubscription?.unsubscribe();
    this.clearInputMessageSubscription?.unsubscribe();
  }



 

  ngAfterViewInit() {
    this.checkPlaceholder();
    this.sendMessageUserSubscription = this.devspaceService.sendMessageUser$.subscribe(user => {
      if (user) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.insertContactByName(user);
            this.checkPlaceholder();
          }, 0);
        });
      }
    });   

    this.inputSearchAddMessage();
    const observer = new MutationObserver(() => {
      this.updateContactAndChannelArrays();
    });

    const config = { childList: true, characterData: true, subtree: true };
    observer.observe(this.addInput.nativeElement, config);
    if (!this.devspaceService.openMessage) {
      observer.disconnect();
    }

    if (this.devspaceService.openMessage) {
      this.clearInputMessageSubscription = this.devspaceService.clearInputMessage$.subscribe((clearInput) => {
        if (clearInput) {
          this.addInput.nativeElement.innerHTML = '';
        }
      });
    }
  }

  updateContactAndChannelArrays() {
    const contacts = this.contactNameInput();
    const channels = this.channelNameInput();
    this.devspaceService.contactArray.next(contacts);
    this.devspaceService.channelArray.next(channels);
    this.zone.run(() => {
      this.cdRef.detectChanges();
    });
  }

 checkPlaceholder() {
    const div = this.addInput.nativeElement;
    const hasText = div.textContent?.trim().length > 0;
    const hasContactSpans = div.querySelectorAll('span[data-contact-input="true"]').length > 0;
    const hasChannelSpans = div.querySelectorAll('span[data-channel-Input="true"]').length > 0;
    if (!hasText && !hasContactSpans && !hasChannelSpans) {
      div.classList.add('placeholder-active');
    } else {
      div.classList.remove('placeholder-active');
    }
  }

  inputSearchAddMessage() {
    this.addInput.nativeElement.addEventListener('input', () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || "";
      if (textBeforeCursor.endsWith("@")) {
        this.devspaceService.openContactBarSearch = true;
        this.devspaceService.openSmileyBar = false;
        this.devspaceService.openContactBar = false;
        this.devspaceService.openChannelBar = false;
      } else {
        this.devspaceService.openContactBarSearch = false;
      }

      if (textBeforeCursor.endsWith("#")) {
        this.devspaceService.openChannelBarSearch = true;
        this.devspaceService.openSmileyBar = false;
        this.devspaceService.openContactBar = false;
        this.devspaceService.openChannelBar = false;
      } else {
        this.devspaceService.openChannelBarSearch = false;
      }
    });
  }

  contactNameInput() {
    const contacts = this.addInput.nativeElement.querySelectorAll('span[data-contact-input="true"]');
    const contactArray: any[] = [];
    contacts?.forEach((span: HTMLElement) => {
      const contactName = span.textContent?.slice(1);
      contactArray.push(contactName);
    });
    const sortContacts = [...new Set(contactArray)];
    return sortContacts;
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

  selectContactSearch(i: number): void {
    this.devspaceService.openContactBarSearch = false;
    const contactName = this.devspaceService.accounts[i].displayName;
    this.insertContactByName(contactName);
  }

  selectChannelSearch(i: number) {
    this.devspaceService.openChannelBarSearch = false;
    const channelName = this.devspaceService.channels[i].title;
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
    this.cdRef.detectChanges();
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    this.cdRef.detectChanges();
  }

  insertContactByName(contactName: string): void {
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
    this.cdRef.detectChanges();

    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    this.cdRef.detectChanges();
  }
}
