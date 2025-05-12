import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UserListItemComponent } from '@components/user-list-item/user-list-item.component';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { Devspace } from '@shared/interface/devspace';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { ChatMessage } from '@shared/interface/chat-message';
import { collection, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    UserListItemComponent
  ],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit, OnDestroy {
  @Input() variant: 'desktop' | 'mobile' = 'desktop';

  searchControl = new FormControl('');
  placeholder = 'Suchen...';
  IconSize = IconSize;
  Color = Color;
  showResults = false;
  resultClicked = false;
  hasSearched = false;

  searchResults: {
    channels: Devspace[];
    users: DevspaceAccount[];
    messages: ChatMessage[];
  } = {
    channels: [],
    users: [],
    messages: []
  };

  allChannels: Devspace[] = [];
  allUsers: DevspaceAccount[] = [];
  allMessages: ChatMessage[] = [];

  private channelSubscription?: Subscription;

  constructor(
    public devspaceService: DevspaceService,
    private eRef: ElementRef,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.channelSubscription =
      this.devspaceService.Firestore.channels$.subscribe((channels) => {
        this.allChannels = channels;        
      });

    this.allUsers = this.devspaceService.accounts;
    this.allMessages = await this.loadAllMessages();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term: string | null) => {
        this.filterResults(term?.trim().toLowerCase() || '');
      });
  }

  ngOnDestroy(): void {
    this.channelSubscription?.unsubscribe();
  }

  filterResults(term: string): void {
    this.showResults = true;
    this.hasSearched = !!term;
    if (!term) {
      this.searchResults = { channels: [], users: [], messages: [] };
      return;
    }

    this.searchResults.channels = this.allChannels.filter(
      (c) =>
        c.title?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
    );

    this.searchResults.users = this.allUsers.filter((u) =>
      u.displayName?.toLowerCase().includes(term)
    );

    this.searchResults.messages = this.allMessages.filter((m) =>
      m.message?.toLowerCase().includes(term)
    );
  }

  async loadAllMessages(): Promise<ChatMessage[]> {
    const messages: ChatMessage[] = [];
    const channelSnapshot = await getDocs(
      collection(this.devspaceService.Firestore.firestore, 'channel')
    );

    for (const channelDoc of channelSnapshot.docs) {
      const channelId = channelDoc.id;
      const messagesRef = collection(
        this.devspaceService.Firestore.firestore,
        `channel/${channelId}/messages`
      );
      const messagesSnap = await getDocs(messagesRef);

      messagesSnap.forEach((doc) => {
        const data = doc.data() as ChatMessage;
        messages.push({ ...data, id: doc.id, channelId });
      });
    }

    return messages;
  }

  goToChannel(channelId: string): void {
    this.devspaceService.selectedChannelId = channelId;
    this.devspaceService.openMessage = false;
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.openChannel = true;

    this.searchControl.setValue('');
    this.showResults = false;
    this.hasSearched = false;
  }

  goToUser(userId: string): void {
    this.router.navigate(['/profile', userId]);
    this.searchControl.setValue('');
    this.showResults = false;
  }

  goToMessage(msg: ChatMessage): void {
    if (msg.channelId) {
      this.router.navigate(['/channel', msg.channelId], {
        queryParams: { highlight: msg.id }
      });
    }
    this.searchControl.setValue('');
    this.showResults = false;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      !this.eRef.nativeElement.contains(event.target) &&
      !this.resultClicked
    ) {
      this.showResults = false;
    }
  }
}
