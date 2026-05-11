import { TestBed } from '@angular/core/testing';

import { DatahandlerService } from './datahandler.service';

describe('DatahandlerService', () => {
  let service: DatahandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatahandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
