import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DesktopViewOnlyGuard implements CanActivate {
  /**
   * canActivate function.
   * @returns {*} Result.
   */
  canActivate(): boolean {
    return window.innerWidth > 767; // allow only mobile/tablet
  }
}