import { TestBed } from '@angular/core/testing';

import { HTTPManagerService } from './httpmanager.service';

describe('HTTPManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HTTPManagerService = TestBed.get(HTTPManagerService);
    expect(service).toBeTruthy();
  });
});
