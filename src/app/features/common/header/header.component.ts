import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { MainMenu, Menu } from '../../../shared/model/sidebar.model';
import { DataService } from '../../../shared/data/data.service';
import { CommonService } from '../../../shared/common/common.service';
import { SidebarService } from '../../../shared/sidebar/sidebar.service';
import { SettingsService } from '../../../shared/settings/settings.service';
import { DatahandlerService } from '../../../services/datahandler.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

declare var bootstrap: any
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterLink]
})
export class HeaderComponent {

  base = '';
  page = '';
  last = '';
  themeMode = 'light';
  public miniSidebar = false;
  routes = routes;
  public multilevel: boolean[] = [false, false, false];
  public submenus = false;
  public addClass = false;
  /**
   * openSubmenus function.
   * @returns {*} Result.
   */
  openSubmenus() {
    this.submenus = !this.submenus;
  }
  side_bar_data: MainMenu[] = [];
  openMenuItem: any = null;
  openSubmenuOneItem: any = null;
  multiLevel1 = false;
  multiLevel2 = false;
  multiLevel3 = false;
  user: any;

  constructor(
    private data: DataService,
    private common: CommonService,
    private sidebar: SidebarService,
    public settings: SettingsService,
    private sideBar: SidebarService,
    private dataserve: DatahandlerService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.common.base.subscribe((base: string) => {
      this.base = base;
    });
    this.common.page.subscribe((page: string) => {
      this.page = page;
    });
    this.common.last.subscribe((last: string) => {
      this.last = last;
    });
    this.sidebar.sideBarPosition.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });

    this.settings.themeColor.subscribe((res: string) => {
      this.themeMode = res;
    });

  }
  elem = document.documentElement;
  /**
   * fullscreen function.
   * @returns {*} Result.
   */
  fullscreen() {
    if (!document.fullscreenElement) {
      this.elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
    });
  }


  /**
   * toggleSidebar function.
   * @returns {*} Result.
   */
  public toggleSidebar(): void {
    this.sidebar.switchMobileSideBarPosition();
    this.addClass = !this.addClass;
    /* eslint no-var: off */
    var root = document.getElementsByTagName('html')[0];
    /* eslint no-var: off */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var sidebar: any = document.getElementById('sidebar')
    var mainwrapper: any = document.querySelector('.main-wrapper')

    if (this.addClass) {
      root.classList.add('menu-opened');
      mainwrapper.classList.add('slide-nav');
    }
    else {
      root.classList.remove('menu-opened');
      mainwrapper.classList.remove('slide-nav');
    }
  }

  /**
   * togglesMobileSideBar function.
   * @returns {*} Result.
   */
  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();

  }

  /**
   * miniSideBarMouseHover function.
   * @param {*} position - Parameter.
   * @returns {*} Result.
   */
  public miniSideBarMouseHover(position: string): void {
    if (this.settings.SideBarMouseHover === true) {
      if (position == 'over') {
        this.sidebar.expandSideBar.next('true');
      } else {
        this.sidebar.expandSideBar.next('false');
      }
    }
  }

  /**
   * changeTheme function.
   * @returns {*} Result.
   */
  changeTheme() {
    if (this.themeMode === 'light') {
      this.changeThemeColor('dark')
    }
    else {
      this.changeThemeColor('light')
    }
  }
  /**
   * changeThemeColor function.
   * @param {*} theme - Parameter.
   * @returns {*} Result.
   */
  public changeThemeColor(theme: string): void {
    this.settings.themeColor.next(theme);
    this.settings.changeThemeColor(theme);
    localStorage.setItem('themeMode', theme);
  }
  /**
   * miniSideBarBlur function.
   * @param {*} position - Parameter.
   * @returns {*} Result.
   */
  miniSideBarBlur(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next('true');
    } else {
      this.sideBar.expandSideBar.next('false');
    }
  }

  /**
   * miniSideBarFocus function.
   * @param {*} position - Parameter.
   * @returns {*} Result.
   */
  miniSideBarFocus(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next('true');
    } else {
      this.sideBar.expandSideBar.next('false');
    }
  }


  /**
   * openMenu function.
   * @param {*} menu - Parameter.
   * @returns {*} Result.
   */
  openMenu(menu: any): void {
    if (this.openMenuItem === menu) {
      this.openMenuItem = null;
    } else {
      this.openMenuItem = menu;
    }
  }
  /**
   * openSubmenuOne function.
   * @param {*} subMenus - Parameter.
   * @returns {*} Result.
   */
  openSubmenuOne(subMenus: any): void {
    if (this.openSubmenuOneItem === subMenus) {
      this.openSubmenuOneItem = null;
    } else {
      this.openSubmenuOneItem = subMenus;
    }
  }
  /**
   * expandSubMenus function.
   * @param {*} menu - Parameter.
   * @returns {*} Result.
   */
  public expandSubMenus(menu: Menu): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: MainMenu) => {
      mainMenus.menu.map((resMenu: Menu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
          if (menu.showSubRoute === false) {
            sessionStorage.removeItem('menuValue');
          }
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  /**
   * multiLevelOne function.
   * @returns {*} Result.
   */
  multiLevelOne() {
    this.multiLevel1 = !this.multiLevel1;
  }
  /**
   * multiLevelTwo function.
   * @returns {*} Result.
   */
  multiLevelTwo() {
    this.multiLevel2 = !this.multiLevel2;
  }
  /**
   * multiLevelThree function.
   * @returns {*} Result.
   */
  multiLevelThree() {
    this.multiLevel3 = !this.multiLevel3;
  }
  /**
   * onLogout function.
   * @returns {*} Result.
   */
  onLogout() {
    this.dataserve.logout().subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
      }
    });
  }

  /**
   * onToggleSidebar function.
   * @returns {*} Result.
   */
  onToggleSidebar(): void {
    const layout = document.documentElement.getAttribute('data-layout');

    if (layout === 'hidden') {
      this.settings.togglehidden();
    } else {
      this.toggleSidebarmini();
    }
  }

  /**
   * toggleSidebarmini function.
   * @returns {*} Result.
   */
  public toggleSidebarmini(): void {
    this.sidebar.switchSideMenuPosition();
  }

}
