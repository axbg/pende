import { TestBed } from '@angular/core/testing';

import { ExecutionService } from './execution.service';

describe('ExecutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExecutionService = TestBed.get(ExecutionService);
    expect(service).toBeTruthy();
  });
});
