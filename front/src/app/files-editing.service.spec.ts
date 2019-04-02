import { TestBed } from '@angular/core/testing';

import { FilesEditingService } from './files-editing.service';

describe('FilesEditingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilesEditingService = TestBed.get(FilesEditingService);
    expect(service).toBeTruthy();
  });
});
