import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { SearchService } from '@shared/services/search-services/search.service';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';

import { Devspace } from '@shared/interface/devspace';
import { DevspaceAccount } from '@shared/interface/devspace-account';
import { ChatMessage } from '@shared/interface/chat-message';
@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  @Input() variant: 'desktop' | 'mobile' = 'desktop';

  searchControl = new FormControl('');
  placeholder = 'Suchen...';

  IconSize = IconSize;
  Color = Color;

  searchResults: {
    channels: Devspace[];
    users: DevspaceAccount[];
    messages: ChatMessage[];
  } = {
    channels: [],
    users: [],
    messages: []
  };

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term: string | null) => {
        if (term && term.trim() !== '') {
          this.performSearch(term);
        } else {
          this.searchResults = { channels: [], users: [], messages: [] };
        }
      });
  }

  async performSearch(term: string): Promise<void> {
    this.searchService.searchChannelsAndUsers(term).subscribe((res) => {
      this.searchResults.channels = res.channels as Devspace[];
      this.searchResults.users = res.users as DevspaceAccount[];
    });

    const messages = await this.searchService.searchMessages(term);
    this.searchResults.messages = messages as ChatMessage[];
  }
}
