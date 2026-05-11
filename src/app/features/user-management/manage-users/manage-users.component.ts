import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from '../../../shared/routes/routes';
import { pageSelection, userList, roles } from '../../../shared/model/pages.model';
import {
  PaginationService,
  provideLocalPagination,
} from '../../../shared/custom-pagination/pagination.service';
import { DataService } from '../../../shared/data/data.service';
import { DateRangePickerComponent } from '../../common/date-range-picker/date-range-picker.component';
import { AuthService } from '../../../services/auth.service';
import { DatahandlerService } from '../../../services/datahandler.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../../shared/common/confirm-modal/confirm-modal.component';
import { CommonFormModalComponent } from '../../../shared/common/common-form-modal/common-form-modal.component';
import { CreditReferenceComponent } from '../../components/forms/credit-reference/credit-reference.component';
import { RechargeComponent } from "../../components/forms/recharge/recharge.component";
import { CreateLevelUserComponent } from '../../components/forms/create-level-user/create-level-user.component';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, skip as rxSkip, take } from 'rxjs';
import { ExportDropdownComponent } from "../../../shared/common/export-dropdown/export-dropdown.component";
import { ChangePasswordFormComponent } from '../../components/forms/change-password-form/change-password-form.component';

interface Level {
  level: number;
  shortName: string;
  title: string;
  uuid: string;
}

interface FormField {
  userLevelId: string;
  formFieldId: {
    errorMessages: {
      required: string;
      minLength?: string;
      maxLength?: string;
      regex?: string;
    };
    name: string;
    label: string;
    inputType: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    regex?: string;
    required?: boolean;
    status?: string;
    uuid: string;
    options?: { label: string; value: any }[];
  };
  isRequired: boolean;
  isEnabled: boolean;
  order: number;
  uuid: string;
}
declare var bootstrap: any;
@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgxEditorModule,
    MatSelectModule,
    FormsModule,
    BsDatepickerModule,
    MatChipsModule,
    MatIconModule,
    CustomPaginationComponent,
    CollapseHeaderComponent,
    ReactiveFormsModule,
    MatSortModule,
    ConfirmModalComponent,
    CommonFormModalComponent,
    CreditReferenceComponent,
    RechargeComponent,
    CreateLevelUserComponent,
    ExportDropdownComponent,
    ChangePasswordFormComponent
],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
  providers: [provideLocalPagination()],
})
export class ManageUsersComponent {
  @ViewChild('changeStatusModal') changeStatusModal!: ElementRef; // Taking this to change toggle status only after confirmation
  @ViewChild('creditRefForm') creditRefForm!: CreditReferenceComponent;
  @ViewChild('rechargeForm') rechargeForm!: RechargeComponent;
  @ViewChild('createUserForm') createUserForm!: CreateLevelUserComponent;
  @ViewChild('changePasswordForm')
  changePasswordForm!: ChangePasswordFormComponent;

  breadcrumbDataLevel : any ;
  breadcrumbData: any[] = [];
  public routes = routes;
  public userList: userList[] = [];
  public pageSize = 10;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  public dataSource!: MatTableDataSource<userList>;
  public searchDataValue = '';
  public user: any;
  public level_values: Level[] = [];
  public userLevel: Level[] = []
  public nextLevel: any = '';
  public userLevelUuid: any = 2;
  public formFieldList: FormField[] = [];
  public password: boolean[] = [false];
  public row = true;
  public totalCount = 0
  private selectedUserUuid: string | null = null;
  modalTitle: string = '';
  modalMessage: string = '';
  logoutUserModalTitle: string = 'Logout User';
  logoutUserModalMessage: string = 'Are you sure you want to logout this user?';
  logoutAllModalTitle: string = 'Logout All Users';
  logoutAllModalMessage: string = 'Are you sure you want to logout all other users?';
  pendingLogoutUser: userList | null = null;
  selectedUser: userList = {
    creditReference: 0,
    userName: '',
    userId: '',
    email: '',
    mobile: '',
    status: 0,
    balance: 0,
    uuid: ''
  }
  roles: roles[] = [];
  levelForBcum: any;
  editMode : boolean = false;
  download: any = '';
  downloadType: any = '';
  downloadData: any[] = [];
  currentLevel: any;
  userId: any;
  fromBalanceUser : any;
  private hasLoadedSupportData = false;
  private currentUserFilter: { level?: number; userId?: string } | null = null;
  private suppressPaginationReload = false;

  fileName = 'User Report';
  changePasswordUser: any;
  constructor(
    private dataService: DataService,
    private pagination: PaginationService,
    public authService: AuthService,
    private dataserve: DatahandlerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    // this.dataService.getManagementUser().subscribe(); // Fetch users if needed
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    // Subscribe to user once
    this.authService.user$.pipe(take(1)).subscribe((user: any) => {
      this.user = user;
      this.fromBalanceUser = this.user?.balance
    });

    this.pagination.tablePageSize.pipe(rxSkip(1)).subscribe((pageState) => {
      if (this.suppressPaginationReload) {
        this.suppressPaginationReload = false;
        return;
      }

      this.getTableData(
        { skip: pageState.skip, limit: pageState.pageSize },
        this.currentUserFilter
      );
    });

    // Single route subscription to avoid duplicate initial API calls.
    this.route.queryParamMap
      .pipe(
        map((params) => {
          const levelParam = params.get('level');
          const userId = params.get('userId');
          const parsedLevel = levelParam !== null ? Number(levelParam) : NaN;
          return {
            level: Number.isFinite(parsedLevel) ? parsedLevel : null,
            userId: userId && userId.trim() !== '' ? userId : null,
          };
        }),
        distinctUntilChanged(
          (prev, curr) => prev.level === curr.level && prev.userId === curr.userId
        )
      )
      .subscribe(({ level, userId }) => {
        const nextFilter = level !== null
          ? (userId ? { level, userId } : { level })
          : null;
        const hasFilterChanged =
          this.currentUserFilter?.level !== nextFilter?.level ||
          this.currentUserFilter?.userId !== nextFilter?.userId;

        this.currentUserFilter = nextFilter;

        if (level !== null) {
          this.breadcrumbDataLevel = level;
          this.userId = userId;
        } else {
          this.breadcrumbDataLevel = 2;
          this.breadcrumbData = [];
          this.userId = null;
        }

        if (hasFilterChanged) {
          this.resetPaginationToFirstPage();
        }

        const pageState = this.pagination.getPageState();
        this.getTableData(
          { skip: pageState.skip, limit: pageState.pageSize },
          this.currentUserFilter
        );
      });
  }

  /**
   * togglePassword function.
   * @param {*} index - Parameter.
   * @returns {*} Result.
   */
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }

  private getTableData(queryParams: pageSelection, level: any = null): void {
    this.dataService.getManagementUser(queryParams, level).subscribe((res: any) => {
      this.pageSize = queryParams.limit;
      this.currentLevel = res.data?.levelData;
      this.fromBalanceUser = res.data?.balance;
      this.userList = res.data.users || [];
      this.totalCount = res.data.count || 0;
      this.totalData = res.data.count || 0;
      this.dataSource = new MatTableDataSource<userList>(this.userList);
      this.userLevel = res.data?.levelData ? [res.data.levelData] : [];
      this.serialNumberArray = this.userList.map((_, index) => queryParams.skip + index + 1);
      this.pagination.updateTableState({
        totalData: this.totalData,
        pageSize: queryParams.limit,
        tableData: this.userList,
        serialNumberArray: this.serialNumberArray,
      });

      // Load dependent metadata only after the first user list response.
      if (!this.hasLoadedSupportData) {
        this.hasLoadedSupportData = true;
        this.getRoles();
        this.getUserLevels();
      }
    });
  }

  /**
   * sortData function.
   * @param {*} sort - Parameter.
   * @returns {*} Result.
   */
  public sortData(sort: Sort) {
    const data = this.userList.slice();
    if (!sort.active || sort.direction === '') {
      this.userList = data;
    } else {
      this.userList = data.sort((a, b) => {
        /**
         * aValue function.
         * @returns {*} Result.
         */
        const aValue = (a as never)[sort.active];
        /**
         * bValue function.
         * @returns {*} Result.
         */
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  /**
   * searchData function.
   * @param {*} value - Parameter.
   * @returns {*} Result.
   */
  public searchData(value: string): void {
    this.searchDataValue = value.trim().toLowerCase();
    if (!this.dataSource) {
      return;
    }

    this.dataSource.filter = this.searchDataValue;
    this.userList = this.dataSource.filteredData;
    this.row = this.userList.length > 0;

    this.pagination.updateTableState({
      totalData: this.searchDataValue !== '' ? this.userList.length : this.totalData,
      pageSize: this.pageSize,
      tableData: this.userList,
      serialNumberArray: this.userList.map((_, i) => this.pagination.getPageState().skip + i + 1),
    });
  }

  /**
   * getUserLevels function.
   * @returns {*} Result.
   */
  getUserLevels() {
    this.dataserve.getUserLevels({}).subscribe((res: any) => {
      this.level_values = res?.data;
      this.nextLevel = this.level_values.find((l) => l.level === this.user.level + 1);
    });
  }

  /**
   * getRoles function.
   * @returns {*} Result.
   */
  getRoles(){
    this.dataserve.getRoles({}).subscribe((res: any) => {
      this.roles = res.data
    });
  }

  /**
   * hideAddUserModal function.
   * @returns {*} Result.
   */
  hideAddUserModal() {
    const modalEl = document.getElementById('addUserModal');
    if (modalEl) {
      // Remove Bootstrap 'show' and 'offcanvas-end' classes
      modalEl.classList.remove('show');
      modalEl.style.visibility = 'hidden';
      modalEl.setAttribute('aria-hidden', 'true');

      // Remove backdrop if it exists
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // Remove body overflow styling
      document.body.classList.remove('offcanvas-backdrop', 'show');
      document.body.style.overflow = '';
    }
  }

  /**
   * getNextLevelUsers function.
   * @param {*} user - Parameter.
   * @returns {*} Result.
   */
  getNextLevelUsers = (user: any) => {
    const existingIndex = this.breadcrumbData.findIndex(
      (item) => item.queryParams?.user === user.uuid
    );
    const queryParams = {level: Number(this.userLevel[this.userLevel.length - 1]?.level) + 1, userId: user.uuid};

    if (existingIndex !== -1) {
      // Truncate all items after the existing one
      this.breadcrumbData = this.breadcrumbData.slice(0, existingIndex + 1);
    } else {
      // Add new breadcrumb
			const levelForBcum =  this.level_values.find((l) => l.level == this.breadcrumbDataLevel);
      this.breadcrumbData.push({
        link: "/manage-users",
        userId: user.userId,
        designation: levelForBcum?.title,
        queryParams: queryParams,
      });
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      // queryParamsHandling: 'merge', // keeps other params intact
    });
  }

  /**
   * confirmStatusChange function.
   * @param {*} event - Parameter.
   * @param {*} user - Parameter.
   * @returns {*} Result.
   */
  confirmStatusChange(event: MouseEvent, user: any): void {
    event.preventDefault(); // prevent immediate toggle

    this.selectedUserUuid = user.uuid;
    this.modalTitle = user.status ? 'Disable Confirmation' : 'Enable Confirmation';
    this.modalMessage = `Are you sure you want to ${user.status ? 'disable' : 'enable'} user ${user.userId}?`;
    const modalElement = document.getElementById('changeUserStatus');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * confirmChange function.
   * @returns {*} Result.
   */
  confirmChange(): void {
    if (!this.selectedUserUuid) return;

    // Find the user by uuid and toggle the status
    const userIndex = this.userList.findIndex(u => u.uuid === this.selectedUserUuid);
    if (userIndex!= -1) {
      const status = this.userList[userIndex].status === 0 ?  1 : 0;
      const payload = {
        userId: this.userList[userIndex].uuid,
        status: status, // the new status after toggle
      };

      this.dataService.updateUserStatus(payload).subscribe({
        next: (resp) => {
          this.userList[userIndex].status = status
          this.toastr.success(resp?.message || 'Status updated successfully')
        },
        error: (error) => {
          this.toastr.error(error?.error?.message || 'Something went wrong', 'Error')
          // Optionally handle error UI here
        }
      });
    }
    // Clear the pending user
    this.selectedUserUuid = null;
  }

  /**
   * logoutUser function.
   * Logout a specific user (admin action).
   * @param {*} user - Parameter.
   * @returns {*} Result.
   */
  logoutUser(user: userList): void {
    if (!user?.uuid) {
      return;
    }

    this.dataService.adminLogoutUser(user.uuid).subscribe({
      next: (resp: any) => {
        this.toastr.success(
          resp?.message || `User ${user.userId} logged out successfully`
        );
      },
      error: (err: any) => {
        this.toastr.error(
          err?.error?.message || 'Failed to logout user',
          'Error'
        );
      }
    });
  }

  /**
   * confirmLogoutUser function.
   * @param {*} user - Parameter.
   * @returns {*} Result.
   */
  confirmLogoutUser(user: userList): void {
    if (!user?.uuid) {
      return;
    }
    this.pendingLogoutUser = user;
    this.logoutUserModalTitle = 'Logout User';
    this.logoutUserModalMessage = `Are you sure you want to logout user ${user.userId}?`;
    const modalElement = document.getElementById('confirmLogoutUser');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * confirmLogoutUserAction function.
   * @returns {*} Result.
   */
  confirmLogoutUserAction(): void {
    if (!this.pendingLogoutUser) {
      return;
    }
    const user = this.pendingLogoutUser;
    this.pendingLogoutUser = null;
    this.logoutUser(user);
  }

  /**
   * logoutAllExceptCurrentUser function.
   * Logout all users except the one performing the action.
   * @returns {*} Result.
   */
  logoutAllExceptCurrentUser(): void {
    this.dataService.adminLogoutAllExceptSelf().subscribe({
      next: (resp: any) => {
        this.toastr.success(
          resp?.message || 'All other users have been logged out'
        );
      },
      error: (err: any) => {
        this.toastr.error(
          err?.error?.message || 'Failed to logout other users',
          'Error'
        );
      }
    });
  }

  /**
   * confirmLogoutAllUsers function.
   * @returns {*} Result.
   */
  confirmLogoutAllUsers(): void {
    this.logoutAllModalTitle = 'Logout All Users';
    this.logoutAllModalMessage = 'Are you sure you want to logout all users except current user?';
    const modalElement = document.getElementById('confirmLogoutAllUsers');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * handleFormSave function.
   * @returns {*} Result.
   */
  handleFormSave() {
    this.creditRefForm.submit();
  }

  /**
   * handleFormCancel function.
   * @returns {*} Result.
   */
  handleFormCancel() {
  }

  /**
   * handleRechargeFormSave function.
   * @returns {*} Result.
   */
  handleRechargeFormSave() {
    this.rechargeForm.submit();
  }

  /**
   * handleUserFormSave function.
   * @returns {*} Result.
   */
  handleUserFormSave() {
    this.createUserForm.submit();
  }

  /**
   * onUserFormSubmit_old function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  onUserFormSubmit_old(data: any) {
    const payload :any = {
      userLevelUuid: this.user.userLevelId,
      parentUserUuid: this.user.uuid,
      formData: data,
    };
    // update user
    if (this.selectedUser?.uuid) {
      payload['userUuid'] = this.selectedUser.uuid;
      this.dataserve.updateUser(this.selectedUser?.uuid, payload).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'User updated successfully');
          this.getTableData({ skip: 0, limit: 100 });
          this.hideAllModals();
        },
        error: (err) => this.toastr.error(err?.error?.message || 'Update failed', 'Error')
      });
    } else {
      // Create User
      this.dataserve.createUser(payload).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'User created successfully');
          this.getTableData({ skip: 0, limit: 100 });
          this.hideAllModals();
        },
        error: (err) => this.toastr.error(err?.error?.message || 'Creation failed', 'Error')
      });
    }
  }

    /**
     * onUserFormSubmit function.
     * @param {*} data - Parameter.
     * @returns {*} Result.
     */
    onUserFormSubmit(data: any) {
    const payload: any = {
      userLevelUuid: this.user.userLevelId,
      parentId: this.userId || this.user.uuid,
      formData: data,
    };
    // update user
    if (this.selectedUser?.uuid) {
      payload['userUuid'] = this.selectedUser.uuid;
      this.dataserve.updateUser(this.selectedUser?.uuid, payload).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'User updated successfully');
          this.reloadCurrentTableData();
          this.hideAllModals();
        },
        error: (err) =>
          this.toastr.error(err?.error?.message || 'Update failed', 'Error'),
      });
    } else {
      // Create User
      this.dataserve.createUser(payload).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'User created successfully');
          this.reloadCurrentTableData();
          this.hideAllModals();
        },
        error: (err) =>
          this.toastr.error(err?.error?.message || 'Creation failed', 'Error'),
      });
    }
  }

  /**
   * reloadCurrentTableData function.
   * @returns {*} Result.
   */
  private reloadCurrentTableData(): void {
    const pageState = this.pagination.getPageState();
    this.getTableData(
      { skip: pageState.skip, limit: pageState.pageSize },
      this.currentUserFilter
    );
  }


  /**
   * onFormSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  onFormSubmit(data: any) {
    const payload = {
      toUUID: data.selectedUser,
      creditReference: data.creditReference,
      googleOtp: data.googleOtp
    }
    this.dataService.updateCreditReference(payload).subscribe({
      next: (resp) => {
        this.toastr.success(resp?.message || 'Status updated successfully')
        const userIndex = this.userList.findIndex(u => u.uuid === data.selectedUser);
        if(userIndex != -1) this.userList[userIndex].creditReference = data.creditReference
        this.hideAllModals()
      },
      error: (error) => {
        this.toastr.error(error?.error?.message || 'Something went wrong', 'Error')
        // Optionally handle error UI here
      }
    });
    // Call API here with selectedUser.uuid + new data
  }

  /**
   * onRechargeFormSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  onRechargeFormSubmit(data: any) {
    const payload = {
      toUUID: data.selectedUser,
      amount: data.amount,
      googleOtp: data.googleOtp,
      type: data.type
    }

    this.dataService.updateBalanceForm(payload).subscribe({
      next: (resp) => {
        this.toastr.success(resp?.message || 'Status updated successfully')
        const userIndex = this.userList.findIndex(u => u.uuid === data.selectedUser);
        if(userIndex != -1)
          this.userList[userIndex].balance = {
            $numberDecimal: resp.data.receiverBalance.toString()
          };
        this.hideAllModals()
      },
      error: (error) => {
        this.toastr.error(error?.error?.message || 'Something went wrong', 'Error')
        // Optionally handle error UI here
      }
    });
    // Call API here with selectedUser.uuid + new data
  }

  // openModal = (modalId: any, selectedUser: any = null) => {

  //   if(selectedUser) this.selectedUser = selectedUser
  //   const modalEl = document.getElementById(modalId);
  //   console.log(modalEl, 'modalEl')
  //   if (modalEl) {
  //     const bsModal = new bootstrap.Modal(modalEl);
  //     bsModal.show();
  //   }
  // }

  /**
   * openModal function.
   * @param {*} modalId - Parameter.
   * @param {*} selectedUser - Parameter.
   * @returns {*} Result.
   */
  openModal = (modalId: any, selectedUser: any = null) => {
    if (selectedUser) {
      this.selectedUser = selectedUser;
      this.editMode = true; // we're editing
    } else {
      this.selectedUser = {
        creditReference: 0,
        userName: '',
        userId: '',
        email: '',
        mobile: '',
        status: 0,
        balance: 0,
        uuid: ''
      };
      this.editMode = false; // we're adding
    }

    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  };


  /**
   * hideAllModals function.
   * @returns {*} Result.
   */
  hideAllModals(): void {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach((modalEl: any) => {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
    });
  }

  /**
   * navigateToBreadcrumb function.
   * @param {*} index - Parameter.
   * @returns {*} Result.
   */
  navigateToBreadcrumb(index: number): void {
    const selected = this.breadcrumbData[index];
    this.breadcrumbData = this.breadcrumbData.slice(0, index + 1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams : selected.queryParams || {},
      // queryParamsHandling: 'merge', // keeps other params intact
    });
  }

  /**
   * openUserBreadcrumb function.
   * @param {*} user - Parameter.
   * @returns {*} Result.
   */
  openUserBreadcrumb(user: any): void {
    const existingIndex = this.breadcrumbData.findIndex(
      (item) => item.queryParams?.user === user.uuid
    );
    if (existingIndex !== -1) {
      // Truncate all items after the existing one
      this.breadcrumbData = this.breadcrumbData.slice(0, existingIndex + 1);
    } else {
      // Add new breadcrumb
      this.breadcrumbData.push({
        link: "/management-user",
        userId: user.userId,
        designation: user.role,
        queryParams: { user: user.uuid },
      });
    }

    this.router.navigate(["/management-user"], {
      queryParams: { user: user.uuid },
    });
  }

  /**
   * goBack function.
   * @returns {*} Result.
   */
  goBack() {
    this.location.back();
  }

/**
 * onExportRequest function.
 * @param {*} type - Parameter.
 * @returns {*} Result.
 */
onExportRequest(type: 'pdf' | 'xls') {
  this.download = true;
  this.downloadType = type;
  this.getTableData({ skip: 0, limit: this.totalCount || this.pagination.getPageState().pageSize }, this.currentUserFilter);
}

/**
 * openChangePassword function.
 * @param {*} user - Parameter.
 * @returns {*} Result.
 */
openChangePassword(user: any) {
  this.changePasswordUser = user;
  this.selectedUser = user; // store the selected user
  this.editMode = true; // if needed
  this.openModal('changeUserPasswordModal', user);
}

  /**
   * handleChangePasswordFormSubmit function.
   * @returns {*} Result.
   */
  handleChangePasswordFormSubmit() {
    this.changePasswordForm.onSubmit();
  }

  /**
   * handleChangePasswordFormCancel function.
   * @returns {*} Result.
   */
  handleChangePasswordFormCancel() {
    this.changePasswordForm.reset();
    this.hideAllModals();
    this.changePasswordUser = null;
  }

  /**
   * submitChangePasswordForm function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  submitChangePasswordForm(data: any) {
    const payload = {
      userPassword: data?.currentPassword,
      newPassword: data?.newPassword,
      userId: this.changePasswordUser?.uuid,
    };

    this.dataserve.changePassword(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Password updated successfully');
        this.changePasswordForm.reset();
        this.hideAllModals();
        this.changePasswordUser = null;
      },
      error: (err:any) => {
        this.toastr.error(
          err?.error?.message || 'Password update failed',
          'Error'
        );
      },
    });
  }

  /**
   * resetPaginationToFirstPage function.
   * @returns {void} Result.
   */
  private resetPaginationToFirstPage(): void {
    const pageState = this.pagination.getPageState();
    if (pageState.skip === 0) {
      return;
    }

    this.suppressPaginationReload = true;
    this.pagination.reset(pageState.pageSize);
  }

}
