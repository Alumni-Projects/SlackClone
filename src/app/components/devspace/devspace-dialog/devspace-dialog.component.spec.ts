import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevspaceDialogComponent } from './devspace-dialog.component';

describe('DevspaceDialogComponent', () => {
  let component: DevspaceDialogComponent;
  let fixture: ComponentFixture<DevspaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevspaceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevspaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
