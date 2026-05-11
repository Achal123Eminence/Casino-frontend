import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root'
})
export class RealtimeEventsService {

  constructor(private sse: SseService) { }

  on(type: string) {
    return this.sse.events$.pipe(
      filter(event => event?.type === type)
    );
  }
}
