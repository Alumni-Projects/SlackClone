import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceOpenCloseComponent } from './workspace-open-close.component';

describe('WorkspaceOpenCloseComponent', () => {
  let component: WorkspaceOpenCloseComponent;
  let fixture: ComponentFixture<WorkspaceOpenCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceOpenCloseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceOpenCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
