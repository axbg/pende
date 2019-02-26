import { TestBed } from '@angular/core/testing';

import { TabEditingServiceService } from './tab-editing-service.service';

describe('TabEditingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabEditingServiceService = TestBed.get(TabEditingServiceService);
    expect(service).toBeTruthy();
  });
});
