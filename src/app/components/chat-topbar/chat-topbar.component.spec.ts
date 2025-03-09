import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTopbarComponent } from './chat-topbar.component';

describe('ChatTopbarComponent', () => {
  let component: ChatTopbarComponent;
  let fixture: ComponentFixture<ChatTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTopbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
