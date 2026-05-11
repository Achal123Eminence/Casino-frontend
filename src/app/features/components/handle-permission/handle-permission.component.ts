import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatahandlerService } from '../../../services/datahandler.service';
import { AuthService } from "../../../services/auth.service";
import { MultiSelectDropdownComponent } from '../../../shared/multi-select-dropdown/multi-select-dropdown.component';
import { CollapseHeaderComponent } from "../../common/collapse-header/collapse-header.component";
import { routes } from '../../../shared/routes/routes';

interface Role {
  level: number;
  shortName: string;
  title: string;
  uuid: string;
}

interface PermissionConfig {
  key: string;
  label: string;
  roleSelected: string;
  statusSelected: string;
  usersList: any[];
  usersSelected: any[];
  skip?: number;
  limit?: number;
}

@Component({
  selector: 'app-handle-permission',
  standalone: true,
  imports: [
    FormsModule,
    MultiSelectDropdownComponent,
    CollapseHeaderComponent,
    RouterLink
],
  templateUrl: './handle-permission.component.html',
  styleUrls: ['./handle-permission.component.scss']
})
export class HandlePermissionComponent {
  user: any;
  role_values: Role[] = [];
  isLoadingMap: { [key: string]: boolean } = {};
  currentPage = 1;
  perPage = 50;
  currentDataLength = 0;
  routes = routes;
  permissions: PermissionConfig[] = [
    { key: 'emailVerification', label: 'Email OTP Verification', roleSelected: '', statusSelected: '', usersList: [], usersSelected: [], skip: 0, limit: 50 },
    { key: 'whatsAppVerification', label: 'WhatsApp OTP Verification', roleSelected: '', statusSelected: '', usersList: [], usersSelected: [],  skip: 0, limit: 50 },
    { key: 'googleAuthVerification', label: 'Google Authentication Verification', roleSelected: '', statusSelected: '', usersList: [], usersSelected: [],  skip: 0, limit: 50 },
    { key: 'multiLoginCount', label: 'No of Logins Allowed', roleSelected: '', statusSelected: '', usersList: [], usersSelected: [],  skip: 0, limit: 50 },
  ];

  AuthUserSub!: Subscription;
  userAddSub!: Subscription;
  errorMessage!: string;

  /**
   * constructor function.
   * @param {*} authService - Parameter.
   * @param {*} dataserve - Parameter.
   * @param {*} toastr - Parameter.
   * @param {*} location - Parameter.
   * @returns {*} Result.
   */
  constructor(
    public authService: AuthService,
    private dataserve: DatahandlerService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => this.user = user);
    this.getUserLevels();
  }

  get paginationArray(): number[] {
    return Array.from({ length: Math.ceil(this.currentDataLength / this.perPage) }, (_, i) => i + 1);
  }

  /**
   * onChangeRole function.
   * @param {*} event - Parameter.
   * @param {*} permission - Parameter.
   * @returns {*} Result.
   */
  onChangeRole(event: any, permission: PermissionConfig) {
    permission.roleSelected = event.target.value;
    permission.skip = 0;
    permission.limit = 50;
    permission.usersList = [];

    const filterParams: any = {
      level: permission.roleSelected,
      permission: true,
      skip: permission.skip,
      limit: permission.limit
    };

    this.dataserve.getDownlineUser(filterParams).subscribe((res: any) => {
      permission.usersList = res?.data?.users || [];
      permission.usersSelected = [];
      this.currentDataLength = res?.data?.count || 0;
    });
  }

  /**
   * fetchMoreUsers function.
   * @param {*} permission - Parameter.
   * @returns {*} Result.
   */
  fetchMoreUsers(permission: PermissionConfig) {

    if (permission.usersList.length >= this.currentDataLength) return;

    permission.skip = permission.usersList.length;

    const filterParams: any = {
      level: permission.roleSelected,
      permission: true,
      skip: permission.skip,
      limit: permission.limit
    };

    this.dataserve.getDownlineUser(filterParams).subscribe((res: any) => {
      const newUsers = res?.data?.users || [];
      permission.usersList = [
        ...permission.usersList,
        ...newUsers
      ];

    });
  }

  /**
   * onSave function.
   * @param {*} event - Parameter.
   * @param {*} permission - Parameter.
   * @returns {*} Result.
   */
  onSave(event: any, permission: PermissionConfig) {
    if (!permission.roleSelected) {
      this.toastr.error('Error', 'Please select level before save');
      return;
    }
    if (!permission.statusSelected) {
      this.toastr.error('Error', 'Please select value before save');
      return;
    }

    this.isLoadingMap[permission.key] = true;

    const body: any = {
      key: permission.key,
      roleValue: parseInt(permission.roleSelected),
      users: permission.usersSelected || []
    };

    if (permission.key === 'multiLoginCount') {
      body.value = parseInt(permission.statusSelected);
    } else {
      body.value = permission.statusSelected === 'true';
    }

    this.userAddSub = this.dataserve.updatePemissions(body).subscribe({
      next: () => {
        this.toastr.success('Success', 'Permission Updated Successfully.');
        permission.roleSelected = '';
        permission.statusSelected = '';
        permission.usersList = [];
        permission.usersSelected = [];
        this.isLoadingMap[permission.key] = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error.message || 'Error occurred';
        this.toastr.error('Error', this.errorMessage);
        this.isLoadingMap[permission.key] = false;
      }
    });
  }

  /**
   * getUserLevels function.
   * @returns {*} Result.
   */
  getUserLevels() {
    this.dataserve.getUserLevels({}).subscribe((res: any) => {
      this.role_values = res?.data || [];
    });
  }

  /**
   * ngOnDestroy function.
   * @returns {*} Result.
   */
  ngOnDestroy() {
    this.AuthUserSub?.unsubscribe();
    this.userAddSub?.unsubscribe();
  }

  /**
   * goBack function.
   * @returns {*} Result.
   */
  goBack() {
    this.location.back();
  }

}
