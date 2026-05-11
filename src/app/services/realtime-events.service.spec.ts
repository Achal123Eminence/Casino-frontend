import { TestBed } from '@angular/core/testing';

import { RealtimeEventsService } from './realtime-events.service';

describe('RealtimeEventsService', () => {
  let service: RealtimeEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
