import { Component } from '@angular/core';
import { ManageUsersComponent } from "../manage-users/manage-users.component";
import { HandlePermissionComponent } from "../../components/handle-permission/handle-permission.component";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs';
import { DataService } from '../../../shared/data/data.service';

@Component({
  selector: 'app-manage-user-permissions',
  imports: [ManageUsersComponent, HandlePermissionComponent],
  templateUrl: './manage-user-permissions.component.html',
  styleUrl: './manage-user-permissions.component.scss',
})
export class ManageUserPermissionsComponent {
// List of countries (if used later for filtering/messages)
  countryList: any;

  // Total message count (used for summary/statistics)
  totalCount: number = 0;

  // Currently active tab index
  activeIndex = 0;

  // Logged-in user data
  user: any;

  // User permission object
  permissions: any;
  isUsersTabBootstrapped = false;
  private usersTabPreloadStarted = false;

  // Tabs configuration with permission mapping
  tabs = [
    {
      id: 'manage_users',
      title: 'Manage Users',
      index: 0,
      permissionKey: 'MNGUSRS',
    },
    {
      id: 'handle_permissions',
      title: 'Handle Permissions',
      index: 1,
      permissionKey: 'HANDLPERM',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // Subscribe to logged-in user updates
    this.authService.userSubject.subscribe((user: any) => {
      this.user = user;
      this.permissions = user?.permissions;
      this.syncActiveTab();
    });

    // Read active tab index from route params
    this.route.paramMap.subscribe((params: any) => {
      const index = Number(params.get('tabIndex'));
      this.activeIndex = isNaN(index) ? 0 : index;
      this.preloadUsersForPermissionTab();
      this.syncActiveTab();
    });
  }

  // Navigate to selected tab
  changeTab(index: number) {
    this.router.navigate(['/users', index]);
  }

  // Check if user has permission for a module and action
  hasPermission(permissionKey: string, method: string = 'read'): boolean {
    // Super admin has access to all permissions
    if (this.user?.level === 1) return true;

    // Validate permission from permission matrix
    return (
      this.permissions?.modules?.[permissionKey]?.permissions?.[method] === true
    );
  }

  // Get only the tabs allowed for the current user
  get allowedTabs() {
    return this.tabs.filter((tab) => this.hasPermission(tab.permissionKey));
  }

  // Ensure active tab is valid based on permissions
  syncActiveTab() {
    const allowed = this.allowedTabs;

    // No accessible tabs for the user
    if (!allowed.length) {
      this.activeIndex = -1;
      return;
    }

    // Check if current tab is still allowed
    const stillAllowed = allowed.some((t) => t.index === this.activeIndex);

    // Redirect to first allowed tab if current is invalid
    if (!stillAllowed) {
      this.activeIndex = allowed[0].index;
      this.router.navigate(['/users', this.activeIndex], {
        replaceUrl: true,
      });
    }
  }

  private preloadUsersForPermissionTab() {
    if (this.activeIndex !== 1) {
      this.isUsersTabBootstrapped = true;
      return;
    }

    if (this.usersTabPreloadStarted) {
      return;
    }

    this.usersTabPreloadStarted = true;
    this.isUsersTabBootstrapped = false;

    this.dataService
      .getManagementUser({ skip: 0, limit: 100 })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isUsersTabBootstrapped = true;
        },
        error: () => {
          // Allow tab to render even if preload fails, to avoid blocking the page.
          this.isUsersTabBootstrapped = true;
        },
      });
  }
}
