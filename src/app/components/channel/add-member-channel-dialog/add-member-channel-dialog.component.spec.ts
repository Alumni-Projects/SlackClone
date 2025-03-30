import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberChannelDialogComponent } from './add-member-channel-dialog.component';

describe('AddMemberChannelDialogComponent', () => {
  let component: AddMemberChannelDialogComponent;
  let fixture: ComponentFixture<AddMemberChannelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMemberChannelDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemberChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
