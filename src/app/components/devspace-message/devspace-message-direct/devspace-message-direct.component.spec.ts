import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevspaceMessageDirectComponent } from './devspace-message-direct.component';

describe('DevspaceMessageDirectComponent', () => {
  let component: DevspaceMessageDirectComponent;
  let fixture: ComponentFixture<DevspaceMessageDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevspaceMessageDirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevspaceMessageDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
