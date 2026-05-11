import { Component } from '@angular/core';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { LanguageComponent } from './language/language.component';
import { SportsComponent } from './sports/sports.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../shared/data/data.service';

@Component({
  selector: 'app-default',
  imports: [SportsComponent, CountryComponent, CurrencyComponent, LanguageComponent],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent {
  tabs = [
    {
      id: 'sports',
      title: 'Sports',
      index: 0,
      permissionKey: 'SPORTS',
    },
    {
      id: 'country',
      title: 'Country',
      index: 1,
      permissionKey: 'COUNTRY',
    },
    {
      id: 'currency',
      title: 'Currency',
      index: 2,
      permissionKey: 'CURRENCY',
    },
    {
      id: 'language',
      title: 'Language',
      index: 3,
      permissionKey: 'LANGUAGE',
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
    this.router.navigate(['/default', index]);
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
      this.router.navigate(['/default', this.activeIndex], {
        replaceUrl: true,
      });
    }
  }
}
