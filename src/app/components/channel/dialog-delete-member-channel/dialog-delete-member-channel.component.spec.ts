import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteMemberChannelComponent } from './dialog-delete-member-channel.component';

describe('DialogDeleteMemberChannelComponent', () => {
  let component: DialogDeleteMemberChannelComponent;
  let fixture: ComponentFixture<DialogDeleteMemberChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteMemberChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeleteMemberChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
