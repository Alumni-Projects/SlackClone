import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointsService {
  public breankpointMain: boolean = false
  
  public mobileQuery = window.matchMedia('(max-width: 900px)');
  public isMobileSubject = new BehaviorSubject<boolean>(this.mobileQuery.matches);
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    this.mobileQuery.addEventListener('change', (event) => {
      this.isMobileSubject.next(event.matches);
    });
    this.isMobile$.subscribe(value => {
      
      this.breankpointMain = value;
    });
  }
}
