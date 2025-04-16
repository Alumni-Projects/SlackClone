import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchMessages(term: string) {
    throw new Error('Method not implemented.');
  }
  searchChannelsAndUsers(term: string) {
    throw new Error('Method not implemented.');
  }
  constructor() {}
  placeholder(): string {
    return window.innerWidth > 768 ? 'Devspace durchsuchen' : 'Gehe zu..';
  }
}
