import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { menu, sidebarData, sidebarDataone } from '../model/sidebar.model';
import { DataService } from '../data/data.service';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private collapseSubject = new BehaviorSubject<boolean>(false);
  collapse$ = this.collapseSubject.asObservable();

  /**
   * toggleCollapse function.
   * @returns {*} Result.
   */
  toggleCollapse() {
    this.collapseSubject.next(!this.collapseSubject.value);
  }
 public toggleSideBar: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('isMiniSidebar') || "false"
  );
  public sideBarPosition: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('sideBarPosition') || 'false'
  );

  public toggleMobileSideBar: BehaviorSubject<string> =
    new BehaviorSubject<string>(
      localStorage.getItem('isMobileSidebar') || 'false'
    );

  public expandSideBar: BehaviorSubject<string> = new BehaviorSubject<string>(
    'false'
  );
   private renderer: Renderer2;
  /**
   * constructor function.
   * @param {*} data - Parameter.
   * @param {*} rendererFactory - Parameter.
   * @param {*} common - Parameter.
   * @returns {*} Result.
   */
  constructor(private data: DataService,rendererFactory: RendererFactory2,private common: CommonService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (localStorage.getItem('isMiniSidebar') == 'true') {
      this.expandSideBar.next('false');
    } else {
      this.expandSideBar.next('true');
    }
  }
 /**
  * switchSideMenuPosition function.
  * @returns {*} Result.
  */
 public switchSideMenuPosition(): void {
  const isMiniSidebar = localStorage.getItem('isMiniSidebar');


  const menuValue = sessionStorage.getItem('menuValue');


  if (isMiniSidebar) {
    this.toggleSideBar.next("false");
    localStorage.removeItem('isMiniSidebar');

    this.data.sidebarData1.forEach((mainMenus: sidebarDataone) => {
      mainMenus.menu.forEach((resMenu: menu) => {
        if (menuValue && menuValue === resMenu.menuValue) {

          resMenu.showSubRoute = true;
        }
      });
    });
  } else {
    this.toggleSideBar.next('true');
    localStorage.setItem('isMiniSidebar', 'true');

    this.data.sidebarData1.forEach((mainMenus: sidebarDataone) => {
      mainMenus.menu.forEach((resMenu: menu) => {
        resMenu.showSubRoute = false;
      });
    });
  }

  // Optional: If UI doesn’t update, trigger change detection
  //
 }

  /**
   * switchMobileSideBarPosition function.
   * @returns {*} Result.
   */
  public switchMobileSideBarPosition(): void {
    if (localStorage.getItem('isMobileSidebar')) {
      this.toggleMobileSideBar.next('false');
      localStorage.removeItem('isMobileSidebar');
    } else {
      this.toggleMobileSideBar.next('true');
      localStorage.setItem('isMobileSidebar', 'true');
    }
  }
  public showDark: BehaviorSubject<string | boolean> = new BehaviorSubject<string | boolean>(
    localStorage.getItem('isDarkTheme') || false
  );
  /**
   * themeColor function.
   * @returns {*} Result.
   */
  public themeColor(): void {
    if (localStorage.getItem('isDarkTheme')) {
      this.showDark.next("false");
      localStorage.removeItem('isDarkTheme');
    } else {
      this.showDark.next('true');
      localStorage.setItem('isDarkTheme', 'true');
    }
  }
public side_bar_data: Array<sidebarDataone> = [];
 private collapseSubMenuSource = new Subject<void>();
  collapseSubMenu$ = this.collapseSubMenuSource.asObservable();

  /**
   * triggerCollapseSubMenus function.
   * @returns {*} Result.
   */
  triggerCollapseSubMenus() {
    this.collapseSubMenuSource.next();
  }

    /**
     * filterSidebarByAccess function.
     * @param {*} sidebar - Parameter.
     * @param {*} permissions - Parameter.
     * @returns {*} Result.
     */
  filterSidebarByAccess(sidebar: any[], permissions: any): any[] {
    // Support both permissions.modules (nested) and permissions being the module map directly
    const modulePerms = permissions?.modules ?? permissions ?? {};
    /**
     * hasReadAccess function.
     * @param {*} item - Sidebar item/submenu config.
     * @returns {*} Result.
     */
    const hasReadAccess = (item: any): boolean => {
      if (Array.isArray(item?.permissionKeys) && item.permissionKeys.length) {
        return item.permissionKeys.some(
          (key: string) => modulePerms[key]?.permissions?.read === true
        );
      }
      if (item?.permissionKey) {
        return modulePerms[item.permissionKey]?.permissions?.read === true;
      }
      return false;
    };

    return sidebar
      .map((section) => {
        const menu = section.menu
          .map((item: any) => {
            /* ───────── MENU WITH SUBMENUS ───────── */
            if (item.hasSubRoute && Array.isArray(item.subMenus)) {
              const allowedSubMenus = item.subMenus.filter((sub: any) => {
                return hasReadAccess(sub);
              });
              if (!allowedSubMenus.length) return null;
              return { ...item, subMenus: allowedSubMenus };
            }
            /* ───────── MENU WITHOUT SUBMENUS ───────── */
            /* SPECIAL CASE: CTFC Users */
            if (item.menuValue === 'CTFC Users') {
              const allowed = ['MSGMNG', 'ROLMNG', 'CHTAGNT'].some(
                (key) => modulePerms[key]?.permissions?.read === true
              );
              return allowed ? item : null;
            }
            /* Normal single-menu permission check */
            return hasReadAccess(item)
              ? item
              : null;
          })
          .filter(Boolean);
        return menu.length ? { ...section, menu } : null;
      })
      .filter(Boolean);
  }

}
