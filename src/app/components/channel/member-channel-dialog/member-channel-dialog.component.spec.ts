import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberChannelDialogComponent } from './member-channel-dialog.component';

describe('MemberChannelDialogComponent', () => {
  let component: MemberChannelDialogComponent;
  let fixture: ComponentFixture<MemberChannelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberChannelDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
