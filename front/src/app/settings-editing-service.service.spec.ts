import { TestBed } from '@angular/core/testing';

import { SettingsEditingServiceService } from './settings-editing-service.service';

describe('SettingsEditingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsEditingServiceService = TestBed.get(SettingsEditingServiceService);
    expect(service).toBeTruthy();
  });
});
