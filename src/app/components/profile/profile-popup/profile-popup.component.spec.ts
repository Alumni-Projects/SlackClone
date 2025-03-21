import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePopupComponent } from './profile-popup.component';

describe('ProfilePopupComponent', () => {
  let component: ProfilePopupComponent;
  let fixture: ComponentFixture<ProfilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
