import { Injectable } from '@angular/core';
import { RealtimeEventsService } from './realtime-events.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommonSseHandlerService {
  user: any;
  constructor(
    private realtime: RealtimeEventsService,
    private authService: AuthService,
  ) {
    // console.log("CommonSseHandlerService started");
    this.init();
  }

  /**
   * init function.
   * Subscribes to realtime events and handles force logout for
   * targeted users and global-topic broadcasts.
   * @returns {*} Result.
   */
  private init() {
    this.realtime.on('FORCE_LOGOUT').subscribe(event => {
      this.user = this.authService.currentUser;
      const isTargetedUser = this.user && event?.userId && this.user.uuid === event.userId;
      const isGlobalLogout =
        this.user &&
        (event?.topic === 'global' || event?.global === true) &&
        event?.payload?.exceptUserId !== this.user.uuid;

      if (isTargetedUser || isGlobalLogout) {
        this.authService.redirectToLogin();
      }

    });
    // Add more event types here
  }
}
