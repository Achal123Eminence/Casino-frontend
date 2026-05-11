import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router, Event as RouterEvent, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonSseHandlerService } from './services/common-sse-handler.service';
import { AuthService, SessionUser } from './services/auth.service';

declare const bootstrap: any;

interface PageMediaItem {
  pageName: string;
  pagePathName: string;
  videoUrl: string;
  autoPlay: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'template';
  public base = '';
  public page = '';
  pageMediaMap = new Map<string, PageMediaItem>();
  activeGuideVideoUrl: SafeResourceUrl | null = null;
  activeGuideVideoTitle = 'Page Guide Video';
  /**
   * constructor function.
   * @param {*} router - Parameter.
   * @returns {*} Result.
   */
  constructor(
    private router: Router,
    private commonSseHandlerService: CommonSseHandlerService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.commonSseHandlerService;
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        const URL = event.url.split('/');
        this.base =URL[1] ? URL[1].replace('-',' '): '';
        this.page = URL[2] ? URL[2].replace('-',' '): '';
      }
      if(this.base === 'index'){
        this.page = 'Deals Dashboard'
      }
      if(this.base === 'lead dashboard' || this.base === 'project dashboard'
        ||this.base ==='pipeline' || this.base === 'payments' ||this.base === 'analytics' ||this.base === 'sources'
        ||this.base ==='lost reason' || this.base === 'contact stage' ||this.base === 'industry' ||this.base === 'calls'
        ||this.base ==='manage users' || this.base === 'roles permissions' ||this.base === 'permission' ||this.base === 'delete request'
        ||this.base ==='pages' || this.base === 'roles permissions' ||this.base === 'testimonials' ||this.base === 'faq'
        ||this.base ==='contact messages' || this.base === 'tickets' ||this.base === 'testimonials' ||this.base === 'faq'
        ||this.base ==='login' || this.base === 'forgot password' ||this.base === 'email verification' ||this.base === 'two step verification'
        ||this.base ==='reset password' || this.base === 'coming soon' ||this.base === 'under maintenance' 
        ||this.base ==='layout fullwidth' || this.base === 'layout hoverview' ||this.base === 'layout rtl' 
        ||this.base ==='layout mini' || this.base === 'layout hidden' ||this.base === 'layout dark' 
        ||this.base ==='notifications' 
      ){
        this.page = this.base
      }
      // if (event instanceof NavigationEnd){}
    });

    this.authService.user$.subscribe((user) => {
      this.pageMediaMap = this.buildPageMediaMap(user);
      this.handleRouteGuideVideo(this.router.url || '');
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.handleRouteGuideVideo(event.urlAfterRedirects || event.url);
      });
  }

  /**
   * closeGuideVideoModal function.
   * @returns {void} Result.
   */
  closeGuideVideoModal(): void {
    const modalEl = document.getElementById('pageGuideVideoModal');
    if (!modalEl) return;
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    this.activeGuideVideoUrl = null;
  }

  /**
   * buildPageMediaMap function.
   * @param {SessionUser | null | undefined} user - Logged-in user details with bootstrap page media.
   * @returns {Map<string, PageMediaItem>} Result.
   */
  private buildPageMediaMap(user: SessionUser | null | undefined): Map<string, PageMediaItem> {
    const map = new Map<string, PageMediaItem>();
    const values = Array.isArray(user?.pageMedia) ? user.pageMedia : [];

    values.forEach((item: any) => {
      const pagePathName = this.normalizePath(item?.pagePathName);
      const videoUrl = String(item?.videoUrl || '').trim();
      if (!pagePathName || !videoUrl ) return;
      map.set(pagePathName, {
        pageName: String(item?.pageName || 'Page Guide').trim() || 'Page Guide',
        pagePathName,
        videoUrl,
        autoPlay: item?.autoPlay,
      });
    });

    return map;
  }

  /**
   * handleRouteGuideVideo function.
   * @param {string} url - Current route URL.
   * @returns {void} Result.
   */
  private handleRouteGuideVideo(url: string): void {
    const path = this.normalizePath(url);
    if (!path) return;

    const pageVideo = this.findPageVideoForPath(path);
    if (!pageVideo?.videoUrl) {
      this.closeGuideVideoModal();
      return;
    }

    const embedUrl = this.toYoutubeEmbedUrl(pageVideo.videoUrl, Boolean(pageVideo.autoPlay));
    if (!embedUrl) {
      return;
    }

    this.activeGuideVideoTitle = pageVideo.pageName || 'Page Guide Video';
    this.activeGuideVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    setTimeout(() => {
      const modalEl = document.getElementById('pageGuideVideoModal');
      if (!modalEl) return;
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }, 0);
  }

  /**
   * normalizePath function.
   * @param {*} value - Parameter.
   * @returns {string} Result.
   */
  private normalizePath(value: any): string {
    let path = String(value || '').trim();
    if (!path) return '';
    path = path.split('?')[0]?.split('#')[0] || '';
    if (!path.startsWith('/')) path = `/${path}`;
    path = path.replace(/\/{2,}/g, '/');
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path;
  }

  /**
   * toYoutubeEmbedUrl function.
   * @param {*} videoUrl - Parameter.
   * @returns {string} Result.
   */
  private toYoutubeEmbedUrl(videoUrl: any, autoPlay = false): string {
    const value = String(videoUrl || '').trim();
    if (!value) return '';

    const watchMatch = value.match(/[?&]v=([\w-]{6,})/);
    const shortMatch = value.match(/youtu\.be\/([\w-]{6,})/);
    const embedMatch = value.match(/youtube\.com\/embed\/([\w-]{6,})/);
    const videoId = watchMatch?.[1] || shortMatch?.[1] || embedMatch?.[1] || '';
    if (!videoId) return '';

    const autoplayValue = autoPlay ? "1" : "0";
    const muteValue = autoPlay ? "1" : "0";
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplayValue}&mute=${muteValue}&rel=0`;
  }

  /**
   * findPageVideoForPath function.
   * @param {string} currentPath - Current route path.
   * @returns {PageMediaItem | null} Result.
   */
  private findPageVideoForPath(currentPath: string): PageMediaItem | null {
    const exact = this.pageMediaMap.get(currentPath);
    if (exact) return exact;

    for (const [storedPath, item] of this.pageMediaMap.entries()) {
      if (this.isPathMatch(storedPath, currentPath)) {
        return item;
      }
    }

    return null;
  }

  /**
   * isPathMatch function.
   * @param {string} patternPath - Stored path pattern.
   * @param {string} currentPath - Current route path.
   * @returns {boolean} Result.
   */
  private isPathMatch(patternPath: string, currentPath: string): boolean {
    if (!patternPath || !currentPath) return false;
    if (patternPath === currentPath) return true;

    const escapeRegex = (value: string) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regexSource = escapeRegex(patternPath)
      .replace(/:([A-Za-z0-9_]+)/g, '[^/]+')
      .replace(/\\\*/g, '.*');

    try {
      const regex = new RegExp(`^${regexSource}$`, 'i');
      return regex.test(currentPath);
    } catch {
      return false;
    }
  }
}
