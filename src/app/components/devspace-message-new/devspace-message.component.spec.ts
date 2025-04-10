import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevspaceMessageComponent } from './devspace-message.component';

describe('DevspaceMessageComponent', () => {
  let component: DevspaceMessageComponent;
  let fixture: ComponentFixture<DevspaceMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevspaceMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevspaceMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
