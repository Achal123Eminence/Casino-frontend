import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, Event as RouterEvent, RouterModule } from '@angular/router';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { CommonService } from '../shared/common/common.service';
import { DataService } from '../shared/data/data.service';
import { SettingsService } from '../shared/settings/settings.service';
import { Title } from '@angular/platform-browser';
import { menu, sidebarData, sidebarDataone, url } from '../shared/model/sidebar.model';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './common/layout/layout.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { HeaderComponent } from './common/header/header.component';
import { MenuItem } from 'primeng/api';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter } from 'rxjs';
export interface RouterObject {
  id?: number;
  url: string;
  type?: number;
}
@Component({
  selector: 'app-features',
  imports: [RouterModule,CommonModule,LayoutComponent,SidebarComponent,HeaderComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent implements OnInit {
  public miniSidebar = 'false';
  public expandMenu = 'false';
  public mobileSidebar = 'false';
  public sideBarActivePath = false;
  public headerActivePath = false;
  base = '';
  page = '';
  last = '';
  currentUrl = '';
  layoutMode = '';
  pageTitle = '';
  constructor(
    private sideBar: SidebarService,
    public router: Router,
    private data: DataService,
    private breakpointObserver:BreakpointObserver,
    private common:CommonService,
    private settings:SettingsService,
    private title: Title
  ) 
  {
    this.router.events.pipe(
  filter(event => event instanceof NavigationEnd)
).subscribe(() => {
  this.getRoutes(this.router);
  this.updateTitle();
});
    this.getRoutes(this.router);
    this.updateTitle();

    this.common.base.subscribe((res: string) => {
      this.base = res
    });
    this.common.page.subscribe((res: string) => {
      this.page = res
    });
    this.common.last.subscribe((res: string) => {
      this.last = res
    });

    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = 'true';
      } else {
        this.miniSidebar = 'false';
      }
    });
      this.sideBar.expandSideBar.subscribe((res: string) => {
      this.expandMenu = res;
      if (res == 'false' && this.miniSidebar == 'true') {
        this.data.sidebarData1.map((mainMenus: sidebarDataone) => {
          mainMenus.menu.map((resMenu: menu) => {
            resMenu.showSubRoute = false;
          });
        });
      }
      if (res == 'true' && this.miniSidebar == 'true') {
        this.data.sidebarData1.map((mainMenus: sidebarDataone) => {
          mainMenus.menu.map((resMenu: menu) => {
            const menuValue = sessionStorage.getItem('menuValue');
            if (menuValue && menuValue == resMenu.menuValue) {
              resMenu.showSubRoute = true;
            } else {
              resMenu.showSubRoute = false;
            }
          });
        });
      }
    });
    //mobile sidebarclose
    this.router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
      if (data instanceof NavigationEnd) {
        localStorage.removeItem('isMobileSidebar');
        this.mobileSidebar = 'false';
      }if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
      if (data instanceof NavigationEnd) {
        localStorage.removeItem('isMobileSidebar');
        this.mobileSidebar = 'false';
      }
    });
    this.sideBar.toggleMobileSideBar.subscribe((res: string) => {
      if (res == 'true' || res == 'true') {
        this.mobileSidebar = 'true';
      } else {
        this.mobileSidebar = 'false';
      }
    });
    this.settings.layoutMode.subscribe((layout) => {
      this.layoutMode = layout;
      if (layout == 'mini') {
        this.miniSidebar = 'true';
      } else {
        this.miniSidebar = 'false';
      }
    });


       
  }
  /**
   * toggleMobileSideBar function.
   * @returns {*} Result.
   */
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }
 isCollapsed = false;
/**
 * ngOnInit function.
 * @returns {*} Result.
 */
ngOnInit():void{
     this.data.collapse$.subscribe((collapse: boolean) => {
      this.isCollapsed = collapse;
     });
  this.breakpointObserver.observe(['(min-width: 991.98px)'])
  .subscribe((result: { matches: any; }) => {
    if (result.matches) {
      this.mobileSidebar = 'false';
    } 
  });   
}

  /**
   * getRoutes function.
   * @param {*} route - Parameter.
   * @returns {*} Result.
   */
  private getRoutes(route: RouterObject): void {
    const splitVal =  route?.url.split('/');
    this.common.currentRoute.next(route.url);
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
  }

  /**
   * updateTitle function.
   * Sets the browser tab title based on current route or sidebar metadata.
   * @returns {*} Result.
   */
  private updateTitle(): void {
    const url = this.router.url.split('?')[0].split('#')[0];
    const sidebarTitle = this.findTitleInSidebar(url);
    const computedTitle = sidebarTitle || this.buildTitleFromUrl(url);
    this.pageTitle = computedTitle;
    this.title.setTitle(this.pageTitle);
  }

  /**
   * findTitleInSidebar function.
   * Tries to find a human-friendly title from sidebar configuration.
   * @param {*} url - Current URL.
   * @returns {*} Result.
   */
  private findTitleInSidebar(url: string): string | null {
    const cleanUrl = url.split(';')[0];
    const sections = this.data.sidebarData1 as sidebarDataone[];

    for (const section of sections) {
      const menus = section.menu as menu[];
      for (const item of menus) {
        if (item.route === cleanUrl) {
          return item.menuValue;
        }

        if (Array.isArray(item.subMenus)) {
          for (const sub of item.subMenus) {
            if (sub.route === cleanUrl) {
              return sub.menuValue;
            }
            if (Array.isArray(sub.subMenusTwo)) {
              for (const sub2 of sub.subMenusTwo) {
                if (sub2.route === cleanUrl) {
                  return sub2.menuValue;
                }
              }
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * buildTitleFromUrl function.
   * Fallback title generation from URL segments.
   * @param {*} url - Current URL.
   * @returns {*} Result.
   */
  private buildTitleFromUrl(url: string): string {
    const segments = url.split('?')[0].split('#')[0].split('/').filter(Boolean);
    if (!segments.length) {
      return 'Dashboard';
    }
    const lastSegment = segments[segments.length - 1];
    return this.formatSegment(lastSegment);
  }

  /**
   * formatSegment function.
   * @param {*} segment - URL path segment.
   * @returns {*} Result.
   */
  private formatSegment(segment: string): string {
    const clean = segment.replace(/:.+$/, '');
    return clean
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  /**
   * ngOnDestroy function.
   * @returns {*} Result.
   */
  ngOnDestroy(): void {
    this.settings.changeThemeColor('light');
  }
/**
 * sidebarClose function.
 * @returns {*} Result.
 */
sidebarClose(){
  this.mobileSidebar='false';
  const wrapper = document.getElementsByClassName('main-wrapper')[0];
  const overlay = document.getElementsByClassName('sidebar-overlay')[0];

  if (wrapper) {
    wrapper.classList.remove('slide-nav');
  }

  if (overlay) {
    overlay.classList.remove('opened');
  }
}
}
