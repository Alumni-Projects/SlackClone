import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageInputAreaComponent } from './message-input-area.component';

describe('MessageInputAreaComponent', () => {
  let component: MessageInputAreaComponent;
  let fixture: ComponentFixture<MessageInputAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageInputAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageInputAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
