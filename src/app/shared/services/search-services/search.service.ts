import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() {}
  placeholder(): string {
    return window.innerWidth > 768 ? 'Devspace durchsuchen' : 'Gehe zu..';
  }
}
