import { Injectable, NgZone } from '@angular/core';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private eventSource: EventSource | null = null;
  private apiUrl = environment.baseUrl;

  // Global event stream
  private eventSubject = new Subject<any>();
  events$ = this.eventSubject.asObservable();

  constructor(private zone: NgZone) { }

  connect(): void {
    if (this.eventSource) return;

    this.eventSource = new EventSource(
      `${this.apiUrl}/auth/sse`,
      { withCredentials: true }
    );

    this.eventSource.onmessage = (event) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse(event.data);
          this.eventSubject.next(data);
        } catch {
          console.warn('Invalid SSE payload', event.data);
        }
      });
    };

    this.eventSource.onerror = () => {
      console.log('SSE disconnected');
      this.disconnect();
    };
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }
}
