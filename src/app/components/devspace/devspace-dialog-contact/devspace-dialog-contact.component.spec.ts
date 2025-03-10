import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevspaceDialogContactComponent } from './devspace-dialog-contact.component';

describe('DevspaceDialogContactComponent', () => {
  let component: DevspaceDialogContactComponent;
  let fixture: ComponentFixture<DevspaceDialogContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevspaceDialogContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevspaceDialogContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
