// desktop-view-only.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DesktopViewOnlyGuard implements CanActivate {
  /**
   * constructor function.
   * @param {*} router - Parameter.
   * @returns {*} Result.
   */
  constructor(private router: Router) {}

  /**
   * canActivate function.
   * @returns {*} Result.
   */
  canActivate(): boolean {
    if(window.innerWidth > 767)
      return true 
    else
      this.router.navigate(['/404']);
    return false;
  }
}
