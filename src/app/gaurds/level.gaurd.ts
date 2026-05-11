import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LevelGuard implements CanActivate {
  /**
   * constructor function.
   * @param {*} authService - Parameter.
   * @param {*} router - Parameter.
   * @returns {*} Result.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * canActivate function.
   * @param {*} route - Parameter.
   * @returns {*} Result.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedLevels = route.data['levels'] as number[];
    return this.authService.user$.pipe(
      filter((user) => user !== undefined), // wait until API finishes
      /**
       * take function.
       * @returns {*} Result.
       */
      take(1),
      map((user) => {
        if (user && allowedLevels.includes(user.level)) {
          return true;
        }
        this.router.navigate(['/404']);
        return false;
      })
    );
  }
}
