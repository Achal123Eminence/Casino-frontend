import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { routes } from '../../../shared/routes/routes';
import { DatahandlerService } from '../../../services/datahandler.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

type ProfileSubTab = 'profile' | 'activity' | 'security';

interface WalletSummary {
  wallet: string;
  availableToBet: string;
  availableToWithdraw: string;
  creditReference: string;
}

interface ProfileInfo {
  userId: string;
  uuid: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  timeZone: string;
}

interface ActivityLog {
  id: string;
  dateTime: string;
  description: string;
  ipAddress: string;
  createdBy: string;
  userAgent: string;
  type: string;
}

interface SecurityStatementLog {
  id: string;
  dateTime: string;
  typePermission: string;
  oldValue: string;
  newValue: string;
  createdBy: string;
  ipAddress: string;
  narration: string;
}

@Component({
  selector: 'app-profile-activity',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile-activity.component.html',
  styleUrl: './profile-activity.component.scss',
})
export class ProfileActivityComponent {
  public routes = routes;
  userId = '';
  isLoadingUserDetail = false;
  isUpdatingPassword = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  changePasswordForm: FormGroup;
  activeSubTab: ProfileSubTab = 'profile';
  activityTypeFilter = 'ALL';
  activityLogs: ActivityLog[] = [];
  activityPagination = {
    currentPage: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
  };
  isLoadingActivityLogs = false;
  securityLogs: SecurityStatementLog[] = [];
  securityPagination = {
    currentPage: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
  };
  isLoadingSecurityLogs = false;

  readonly mainTabs = [{ id: 'profile-activity', label: 'Profile & Activity' }];

  readonly subTabs: { id: ProfileSubTab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'activity', label: 'Activity Logs' },
    { id: 'security', label: 'Security Statement' },
  ];

  walletSummary: WalletSummary = {
    wallet: 'Main wallet',
    availableToBet: '₹0.00',
    availableToWithdraw: '₹0.00',
    creditReference: '₹0.00',
  };

  profileInfo: ProfileInfo = {
    userId: '-',
    uuid: '-',
    name: '-',
    email: '-',
    password: '********************',
    mobile: '-',
    timeZone: 'IST'
  };

  readonly activityTypes: { value: string; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'PASSWORD_CHANGED', label: 'Password Changed' },
  ];

  constructor(
    private route: ActivatedRoute,
    private dataHandlerService: DatahandlerService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        userPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const selectedUserUuid = params.get('userId') ?? '';
      this.userId = selectedUserUuid;
      this.activityPagination.currentPage = 1;
      this.activityTypeFilter = 'ALL';
      this.securityPagination.currentPage = 1;
      this.loadUserDetail(selectedUserUuid || undefined);
      this.loadActivityLogs();
    });
  }

  /**
   * filteredActivityLogs function.
   * @returns {*} Result.
   */
  get filteredActivityLogs(): ActivityLog[] {
    return this.activityLogs;
  }

  /**
   * setSubTab function.
   * @param {*} tab - Parameter.
   * @returns {*} Result.
   */
  setSubTab(tab: ProfileSubTab): void {
    this.activeSubTab = tab;
    if (tab === 'activity') {
      this.loadActivityLogs();
    }
    if (tab === 'security') {
      this.loadSecurityLogs();
    }
  }

  /**
   * setActivityType function.
   * @param {*} type - Parameter.
   * @returns {*} Result.
   */
  setActivityType(type: string): void {
    this.activityTypeFilter = type;
    this.activityPagination.currentPage = 1;
    this.loadActivityLogs();
  }

  /**
   * selectedActivityTypeLabel function.
   * @returns {*} Result.
   */
  get selectedActivityTypeLabel(): string {
    const selected = this.activityTypes.find((type) => type.value === this.activityTypeFilter);
    return selected?.label || 'All';
  }

  /**
   * changeActivityPage function.
   * @param {*} page - Parameter.
   * @returns {*} Result.
   */
  changeActivityPage(page: number): void {
    const nextPage = Number(page) || 1;
    if (nextPage < 1 || nextPage > (this.activityPagination.totalPages || 1)) {
      return;
    }
    this.activityPagination.currentPage = nextPage;
    this.loadActivityLogs();
  }

  /**
   * changeSecurityPage function.
   * @param {*} page - Parameter.
   * @returns {*} Result.
   */
  changeSecurityPage(page: number): void {
    const nextPage = Number(page) || 1;
    if (nextPage < 1 || nextPage > (this.securityPagination.totalPages || 1)) {
      return;
    }
    this.securityPagination.currentPage = nextPage;
    this.loadSecurityLogs();
  }

  /**
   * isSelfPasswordChange function.
   * @returns {*} Result.
   */
  get isSelfPasswordChange(): boolean {
    return !this.userId;
  }

  /**
   * currentPasswordLabel function.
   * @returns {*} Result.
   */
  get currentPasswordLabel(): string {
    return this.isSelfPasswordChange ? 'Current Password' : 'Your Password';
  }

  /**
   * openChangePasswordModal function.
   * @returns {*} Result.
   */
  openChangePasswordModal(): void {
    const modalEl = document.getElementById('profileChangePasswordModal');
    if (!modalEl) return;
    this.changePasswordForm.reset();
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  /**
   * closeChangePasswordModal function.
   * @returns {*} Result.
   */
  closeChangePasswordModal(): void {
    const modalEl = document.getElementById('profileChangePasswordModal');
    if (!modalEl) return;
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    this.changePasswordForm.reset();
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  /**
   * submitChangePassword function.
   * @returns {*} Result.
   */
  submitChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { userPassword, newPassword } = this.changePasswordForm.value;

    if (this.isSelfPasswordChange && userPassword === newPassword) {
      this.toastr.error('New password must be different from current password');
      return;
    }

    const payload: any = {
      userPassword,
      newPassword,
    };

    if (!this.isSelfPasswordChange) {
      payload.userId = this.userId;
    }

    this.isUpdatingPassword = true;
    this.dataHandlerService.changePassword(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Password updated successfully');
        this.closeChangePasswordModal();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Password update failed');
      },
      complete: () => {
        this.isUpdatingPassword = false;
      },
    });
  }

  /**
   * loadUserDetail function.
   * @param {*} userId - Parameter.
   * @returns {*} Result.
   */
  private loadUserDetail(userId?: string): void {
    this.isLoadingUserDetail = true;
    this.dataHandlerService.getUserDetail(userId).subscribe({
      next: (res: any) => {
        const data = res?.data || {};
        const balance = Number(data?.balance || 0);
        const creditReference = Number(data?.creditReference || 0);

        this.profileInfo = {
          userId: data?.userId || '-',
          uuid: data?.uuid || '-',
          name: data?.name || '-',
          email: data?.email || '-',
          password: '********************',
          mobile: data?.mobile || '-',
          timeZone: data?.timeZone || 'IST',
        };

        this.walletSummary = {
          wallet: 'Main wallet',
          availableToBet: this.formatCurrency(balance),
          availableToWithdraw: this.formatCurrency(balance),
          creditReference: this.formatCurrency(creditReference),
        };
      },
      error: () => {
        this.profileInfo = {
          userId: '-',
          uuid: '-',
          name: '-',
          email: '-',
          password: '********************',
          mobile: '-',
          timeZone: 'IST'
        };
        this.walletSummary = {
          wallet: 'Main wallet',
          availableToBet: '₹0.00',
          availableToWithdraw: '₹0.00',
          creditReference: '₹0.00',
        };
      },
      complete: () => {
        this.isLoadingUserDetail = false;
      },
    });
  }

  /**
   * loadActivityLogs function.
   * @returns {*} Result.
   */
  private loadActivityLogs(): void {
    this.isLoadingActivityLogs = true;

    const params: any = {
      option: this.activityTypeFilter,
      page: this.activityPagination.currentPage,
      limit: this.activityPagination.limit,
    };
    if (this.userId) {
      params.userId = this.userId;
    }

    this.dataHandlerService.getUserActivityLogs(params).subscribe({
      next: (res: any) => {
        const rows = Array.isArray(res?.data) ? res.data : [];
        this.activityLogs = rows.map((item: any, idx: number) => ({
          id: item?.uuid || `${Date.now()}-${idx}`,
          dateTime: this.formatActivityDate(item?.createdAt),
          description: this.getActivityDescription(item),
          ipAddress: this.extractIp(item),
          createdBy: item?.performedBy?.userId || item?.performedBy?.userName || item?.performedBy?.name || '-',
          userAgent: item?.details?.userAgent || '-',
          type: this.getActivityType(item),
        }));

        const pagination = res?.pagination || {};
        this.activityPagination = {
          currentPage: Number(pagination?.currentPage || this.activityPagination.currentPage || 1),
          limit: Number(pagination?.limit || this.activityPagination.limit || 10),
          totalPages: Number(pagination?.totalPages || 0),
          totalRecords: Number(pagination?.totalRecords || 0),
        };
      },
      error: (err: any) => {
        this.activityLogs = [];
        this.activityPagination.totalPages = 0;
        this.activityPagination.totalRecords = 0;
        this.toastr.error(err?.error?.message || 'Unable to fetch activity logs');
      },
      complete: () => {
        this.isLoadingActivityLogs = false;
      },
    });
  }

  /**
   * loadSecurityLogs function.
   * @returns {*} Result.
   */
  private loadSecurityLogs(): void {
    this.isLoadingSecurityLogs = true;

    const params: any = {
      page: this.securityPagination.currentPage,
      limit: this.securityPagination.limit,
    };
    if (this.userId) {
      params.userId = this.userId;
    }

    this.dataHandlerService.getUserPermissionLogs(params).subscribe({
      next: (res: any) => {
        const rows = Array.isArray(res?.data) ? res.data : [];
        this.securityLogs = rows.map((item: any, idx: number) => {
          const firstChange = Array.isArray(item?.changes) ? item.changes[0] : null;
          return {
            id: item?.uuid || `${Date.now()}-${idx}`,
            dateTime: this.formatActivityDate(item?.createdAt),
            typePermission: this.getPermissionLabel(item?.typePermission),
            oldValue: this.formatPermissionValue(firstChange?.oldValue),
            newValue: this.formatPermissionValue(firstChange?.newValue),
            createdBy:
              item?.createdBy?.userId ||
              item?.createdBy?.userName ||
              item?.createdBy?.name ||
              item?.createdByUserId ||
              '-',
            ipAddress: item?.ip || '-',
            narration: item?.narration || '-',
          };
        });

        const pagination = res?.pagination || {};
        this.securityPagination = {
          currentPage: Number(pagination?.currentPage || this.securityPagination.currentPage || 1),
          limit: Number(pagination?.limit || this.securityPagination.limit || 10),
          totalPages: Number(pagination?.totalPages || 0),
          totalRecords: Number(pagination?.totalRecords || 0),
        };
      },
      error: (err: any) => {
        this.securityLogs = [];
        this.securityPagination.totalPages = 0;
        this.securityPagination.totalRecords = 0;
        this.toastr.error(err?.error?.message || 'Unable to fetch security statements');
      },
      complete: () => {
        this.isLoadingSecurityLogs = false;
      },
    });
  }

  /**
   * getActivityType function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  private getActivityType(item: any): string {
    const module = String(item?.module || '').trim().toUpperCase();
    if (module === 'LOGIN') return 'LOGIN';
    if (module === 'LOGOUT') return 'LOGOUT';
    if (module === 'PASSWORD') return 'PASSWORD_CHANGED';
    return 'ALL';
  }

  /**
   * getActivityDescription function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  private getActivityDescription(item: any): string {
    const type = this.getActivityType(item);
    if (type === 'LOGIN') return 'User Logged In';
    if (type === 'LOGOUT') return 'User Logged Out';
    if (type === 'PASSWORD_CHANGED') return 'Password Changed';
    return String(item?.action || '-');
  }

  /**
   * extractIp function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  private extractIp(item: any): string {
    const detailIp = String(item?.details?.ip || '').trim();
    if (detailIp) return detailIp;
    const actionText = String(item?.action || '').trim();
    const match = actionText.match(/(\d{1,3}(?:\.\d{1,3}){3})/);
    return match?.[1] || '-';
  }

  /**
   * formatActivityDate function.
   * @param {*} value - Parameter.
   * @returns {*} Result.
   */
  private formatActivityDate(value: any): string {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return '-';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const meridian = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${meridian}`;
  }

  /**
   * getPermissionLabel function.
   * @param {*} permissionKey - Parameter.
   * @returns {*} Result.
   */
  private getPermissionLabel(permissionKey: any): string {
    const normalizedKey = String(permissionKey || '').trim();
    const labels: Record<string, string> = {
      emailVerification: 'Email Verification',
      whatsAppVerification: 'WhatsApp Verification',
      googleAuthVerification: 'Google Auth Verification',
      multiLoginCount: 'Multi Login Count',
    };
    return labels[normalizedKey] || normalizedKey || '-';
  }

  /**
   * formatPermissionValue function.
   * @param {*} value - Parameter.
   * @returns {*} Result.
   */
  private formatPermissionValue(value: any): string {
    if (typeof value === 'boolean') return value ? 'Enabled' : 'Disabled';
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
  }

  /**
   * formatCurrency function.
   * @param {*} value - Parameter.
   * @returns {*} Result.
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);
  }

  /**
   * passwordMatchValidator function.
   * @param {*} group - Parameter.
   * @returns {*} Result.
   */
  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * togglePasswordVisibility function.
   * @param {*} field - Parameter.
   * @returns {*} Result.
   */
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }
}
