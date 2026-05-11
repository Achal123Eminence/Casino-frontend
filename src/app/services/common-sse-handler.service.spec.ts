import { TestBed } from '@angular/core/testing';

import { CommonSseHandlerService } from './common-sse-handler.service';

describe('CommonSseHandlerService', () => {
  let service: CommonSseHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonSseHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
