import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModulesComponent } from "../modules/modules.component";
import { CategoryComponent } from "./category/category.component";

@Component({
  selector: 'app-module-management',
  imports: [ModulesComponent, CategoryComponent],
  templateUrl: './module-management.component.html',
  styleUrl: './module-management.component.scss',
})
export class ModuleManagementComponent {
tabs = [
    {
      id: 'category',
      title: 'Category',
      index: 0,
      permissionKey: 'CATEGORY',
    },
    {
      id: 'module',
      title: 'Module',
      index: 1,
      permissionKey: 'MODULES',
    },
  ];

  activeIndex = 0;

  // Logged-in user data
  user: any;

  // User permission object
  permissions: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
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
      this.syncActiveTab();
    });
  }

  // Navigate to selected tab
  changeTab(index: number) {
    this.router.navigate(['/modules', index]);
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
      this.router.navigate(['/modules', this.activeIndex], {
        replaceUrl: true,
      });
    }
  }
}
