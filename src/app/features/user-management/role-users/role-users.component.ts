import { Component, ViewChild } from '@angular/core';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { routes } from '../../../shared/routes/routes';
import { AuthService } from '../../../services/auth.service';
import { DatahandlerService } from '../../../services/datahandler.service';
import { ToastrService } from 'ngx-toastr';
import { RoleUserComponent } from '../../components/forms/role-user/role-user.component';
import { DataService } from '../../../shared/data/data.service';
import { CommonFormModalComponent } from "../../../shared/common/common-form-modal/common-form-modal.component";
import { userList } from '../../../shared/model/pages.model';

// Declare Bootstrap globally
declare var bootstrap: any;

@Component({
  selector: 'app-role-users',
  imports: [
    CustomPaginationComponent,
    CollapseHeaderComponent,
    RouterLink,
    CommonFormModalComponent,
    RoleUserComponent
],
  templateUrl: './role-users.component.html',
  styleUrl: './role-users.component.scss'
})
export class RoleUsersComponent {

  @ViewChild('roleUserForm') roleUserForm!: RoleUserComponent;
  public routes = routes;
  roleUUId: any;
  public userList: userList[] = [];
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
  totalCount: number = this.userList.length;

  constructor(
    private dataService: DataService,
    public auth: AuthService,
    private dataserve: DatahandlerService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    // Read the UUID from query parameters on component construction
    this.route.queryParams.subscribe(params => {
      if (params['uuid']) {
        this.roleUUId = params['uuid'];
      }
    });
  }

  // Lifecycle hook that gets called once the component is initialized
  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.fetchManagementUsers();
  }

  /**
   * fetchManagementUsers function.
   * @returns {*} Result.
   */
  fetchManagementUsers(): void {
    const payload = { uuid: this.roleUUId }
    this.dataserve.getManagementUsersByRole(payload).subscribe((res: any) => {
      this.userList = res?.data;
      this.totalCount = this.userList.length;
    });
  }

  /**
   * Opens a Bootstrap modal by ID
   * @param modalId - The ID of the modal DOM element
   * @param selectedUser - (Optional) If passed, sets the user to be edited/viewed
   */
  openModal = (modalId: any, selectedUser: any = null) => {

    if (selectedUser) this.selectedUser = selectedUser;
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  }

  /**
   * handleFormCancel function.
   * @returns {*} Result.
   */
  handleFormCancel() {
  }

  /**
   * handleRoleUserFormSubmit function.
   * @returns {*} Result.
   */
  handleRoleUserFormSubmit() {
    this.roleUserForm.submit();
  }

  /**
   * onRoleUserSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  onRoleUserSubmit(data: any) {
    let payload = {
      uuid: data?.uuid,
      userName: data?.userName,
      email: data?.email,
      mobile: data?.mobile,
    };

    this.dataserve.updateRoleUser(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'User updated successfully');
        this.fetchManagementUsers();
        this.dataService.hideAllModals();
      },
      error: (err: any) => this.toastr.error(err?.error?.message || 'User update failed', 'Error')
    });
  }

}
