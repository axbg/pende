import { TestBed } from '@angular/core/testing';

import { HTTPInterceptorService } from './httpinterceptor.service';

describe('HTTPInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HTTPInterceptorService = TestBed.get(HTTPInterceptorService);
    expect(service).toBeTruthy();
  });
});
