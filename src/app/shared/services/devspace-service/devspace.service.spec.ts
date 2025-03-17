import { TestBed } from '@angular/core/testing';

import { DevspaceService } from './devspace.service';

describe('DevspaceService', () => {
  let service: DevspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
