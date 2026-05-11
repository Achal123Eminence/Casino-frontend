import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SseService } from '../services/sse.service'
import { Router } from '@angular/router';


export interface SessionUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
  level: number;
  balance: number | string;
  pageMedia?: {
    pageName: string;
    pagePathName: string;
    videoUrl: string;
    autoPlay: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject = new BehaviorSubject<SessionUser | null | undefined>(undefined);
  public user$ = this.userSubject.asObservable();
  private baseUrl = environment.baseUrl;
  private loadUserPromise: Promise<void> | null = null;

  /**
   * constructor function.
   * @param {*} http - Parameter.
   * @returns {*} Result.
   */
  constructor(private http: HttpClient, private sseService: SseService, private router: Router) {
    // this.loadUserFromApi(); // fetch on app start
  }

  get currentUser(): SessionUser | null | undefined {
    return this.userSubject.value;
  }

  /** Fetch user details from backend */
  //   loadUserFromApi() {
  //     this.http.post<SessionUser>(`${this.baseUrl}/user/user-details` , {}).subscribe({
  //       next: (res : any) => this.userSubject.next(res.data),
  //       error: () => this.userSubject.next(null)
  //     });
  //   }

  /**
   * loadUserFromApi function.
   * @returns {*} Result.
   */
  loadUserFromApi(): Promise<void> {
    if (this.loadUserPromise) {
      return this.loadUserPromise;
    }

    this.loadUserPromise = firstValueFrom(
      this.http.post<SessionUser>(`${this.baseUrl}/user/user-details`, {})
    )
      .then((res: any) => {
        const user = res?.data || null;
        this.userSubject.next(res.data);
        if (user) {
          this.sseService.connect();
        }
      })
      .catch(() => {
        this.userSubject.next(null);
      })
      .finally(() => {
        this.loadUserPromise = null;
      });

    return this.loadUserPromise;
  }

  /**
   * login function.
   * @param {*} user - Parameter.
   * @returns {*} Result.
   */
  login(user: SessionUser) {
    this.userSubject.next(user);
  }

  /**
   * updateBalance function.
   * @param {*} newBalance - Parameter.
   * @returns {*} Result.
   */
  updateBalance(newBalance: number) {
    const user = this.userSubject.value;
    if (user) {
      const updated = { ...user, balance: newBalance };
      this.userSubject.next(updated);
    }
  }

  /**
   * logout function.
   * @returns {*} Result.
   */
  logout(): void {
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe({
      next: () => this.cleanupSession(),
      error: () => this.cleanupSession(),
    });
  }
  /**
   * otpVeify function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  otpVeify(data: any) {
    return this.http.post(`${this.baseUrl}/auth/verify-otp`, { ...data });
  }

  hasPermission(permissionKey: string, method: string = 'read'): boolean {
    const user: any = this.currentUser;
    if (!user) return false;
    if (user?.level === 1) return true;
    const modulePerms = user.permissions?.modules ?? user.permissions ?? {};
    return modulePerms[permissionKey]?.permissions?.[method] === true;
  }

  /**
   * 🧹 Cleanup user + SSE
   */
  private cleanupSession(): void {
    this.sseService.disconnect();
    this.userSubject.next(null);
  }

  redirectToLogin () {
    console.log('called from here')
    this.cleanupSession();
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }
}
