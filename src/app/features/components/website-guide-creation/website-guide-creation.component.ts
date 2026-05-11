import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PageVideosTabComponent } from './tabs/page-videos-tab/page-videos-tab.component';
import { GuideCommonTabComponent } from './tabs/guide-common-tab/guide-common-tab.component';

interface GuideTab {
  id: 'website-guide' | 'developer-guide' | 'page-videos';
  title: string;
  index: number;
  modulePermissionKey: string;
  subModulePermissions: {
    category: string;
    info: string;
    docs: string;
    images: string;
    videos: string;
  } | null;
}

interface GuideActionPermissionSet {
  canCreateCategory: boolean;
  canUpdateCategory: boolean;
  canUpdateInfo: boolean;
  canManageDocs: boolean;
  canManageImages: boolean;
  canManageVideos: boolean;
  canDeleteMedia: boolean;
}

@Component({
  selector: 'app-website-guide-creation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    GuideCommonTabComponent,
    PageVideosTabComponent,
  ],
  templateUrl: './website-guide-creation.component.html',
  styleUrl: './website-guide-creation.component.scss',
})
export class WebsiteGuideCreationComponent {
  user: any;

  tabs: GuideTab[] = [
    {
      id: 'website-guide',
      title: 'Website Guide',
      index: 0,
      modulePermissionKey: 'WEBGUIDE',
      subModulePermissions: {
        category: 'WGCAT',
        info: 'WGINFO',
        docs: 'WGDOC',
        images: 'WGIMG',
        videos: 'WGVID',
      },
    },
    {
      id: 'developer-guide',
      title: 'Developer Guide',
      index: 1,
      modulePermissionKey: 'DEVGUIDE',
      subModulePermissions: {
        category: 'DGCAT',
        info: 'DGINFO',
        docs: 'DGDOC',
        images: 'DGIMG',
        videos: 'DGVID',
      },
    },
    {
      id: 'page-videos',
      title: 'Page Videos',
      index: 2,
      modulePermissionKey: 'PAGEVIDEOS',
      subModulePermissions: {
        category: 'PVCAT',
        info: 'PVINFO',
        docs: 'PVDOC',
        images: 'PVIMG',
        videos: 'PVVID',
      },
    },
  ];

  activeIndex = 0;

  /**
   * constructor function.
   * @param {AuthService} authService - Authentication service for user and permission checks.
   * @returns {void} Result.
   */
  constructor(public authService: AuthService) {}

  /**
   * ngOnInit function.
   * @returns {void} Result.
   */
  ngOnInit(): void {
    this.authService.userSubject.subscribe((user: any) => {
      this.user = user;
      this.syncActiveTab();
    });
  }

  /**
   * changeTab function.
   * @param {number} index - Tab index to activate.
   * @returns {void} Result.
   */
  changeTab(index: number): void {
    this.activeIndex = index;
  }

  /**
   * canAccessTab function.
   * @param {GuideTab} tab - Tab definition with mapped permission keys.
   * @returns {boolean} True if user can access the tab.
   */
  canAccessTab(tab: GuideTab): boolean {
    return this.authService.hasPermission(tab.modulePermissionKey, 'read');
  }

  /**
   * canAccessModulePage function.
   * @returns {boolean} True if user can access Website Guide Creation module.
   */
  get canAccessModulePage(): boolean {
    return this.authService.hasPermission('WGCREATE', 'read');
  }

  /**
   * allowedTabs function.
   * @returns {GuideTab[]} Tabs visible to current user.
   */
  get allowedTabs(): GuideTab[] {
    return this.tabs.filter((tab) => this.canAccessTab(tab));
  }

  /**
   * getActionPermissions function.
   * @param {GuideTab} tab - Tab definition.
   * @returns {GuideActionPermissionSet} Action permission flags for tab.
   */
  getActionPermissions(tab: GuideTab): GuideActionPermissionSet {
    const sub = tab.subModulePermissions;
    if (!sub) {
      return {
        canCreateCategory: false,
        canUpdateCategory: false,
        canUpdateInfo: false,
        canManageDocs: false,
        canManageImages: false,
        canManageVideos: false,
        canDeleteMedia: false,
      };
    }

    const canCreateCategory = this.authService.hasPermission(sub.category, 'write');
    const canUpdateCategory = this.authService.hasPermission(sub.category, 'update');
    const canDeleteCategory = this.authService.hasPermission(sub.category, 'delete');
    const canUpdateInfo = this.authService.hasPermission(sub.info, 'update');
    const canManageDocs = this.authService.hasPermission(sub.docs, 'update');
    const canManageImages = this.authService.hasPermission(sub.images, 'update');
    const canManageVideos = this.authService.hasPermission(sub.videos, 'update');

    return {
      canCreateCategory,
      canUpdateCategory,
      canUpdateInfo,
      canManageDocs,
      canManageImages,
      canManageVideos,
      canDeleteMedia: canDeleteCategory || canManageDocs || canManageImages || canManageVideos,
    };
  }

  /**
   * syncActiveTab function.
   * @returns {void} Result.
   */
  syncActiveTab(): void {
    const allowed = this.allowedTabs;

    if (!allowed.length) {
      this.activeIndex = -1;
      return;
    }

    const stillAllowed = allowed.some((tab) => tab.index === this.activeIndex);
    if (!stillAllowed) {
      this.activeIndex = allowed[0].index;
    }
  }
}
