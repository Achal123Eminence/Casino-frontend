import { Component, ViewChild } from '@angular/core';
import { DatahandlerService } from '../../../services/datahandler.service';
import { roles, formFields } from '../../../shared/model/pages.model';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { routes } from '../../../shared/routes/routes';
import { PaginationService } from '../../../shared/custom-pagination/pagination.service';
import { Location } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SideFormModalComponent } from '../../../shared/common/side-form-modal/side-form-modal.component';
import { UserLevelFormComponent } from '../forms/user-level-form/user-level-form.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from "../../../shared/data/data.service"
import { CommonFormModalComponent } from '../../../shared/common/common-form-modal/common-form-modal.component';
import { ModuleComponent } from '../forms/module/module.component';
import { RoleFormComponent } from '../forms/role-form/role-form.component';
import { RoleUserComponent } from '../forms/role-user/role-user.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-role',
  imports: [
    RouterLink,
    CustomPaginationComponent,
    CollapseHeaderComponent,
    SideFormModalComponent,
    UserLevelFormComponent,
    CommonFormModalComponent,
    RoleFormComponent,
    RoleUserComponent
],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})

export class RoleComponent {
  @ViewChild('roleForm') roleForm!: RoleFormComponent;
  @ViewChild('roleUserForm') roleUserForm!: RoleUserComponent;
  roles: roles[] = [];
  formFields: formFields[] = [];
  formFieldLoaded: boolean = false
  routes = routes;
  isModuleLoaded: boolean = false;
  selectedRole: any = null;
  isEditMode: boolean = false;
  selectedRoleData: any = null;

  constructor(
    private dataHandlerService: DatahandlerService,
    private toastr: ToastrService,
    private dataService: DataService,
    private location: Location,
    private router: Router,
    public auth: AuthService
  ){}

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() {
    this.getRoles()
  }

  /**
   * getRoles function.
   * @returns {*} Result.
   */
  getRoles = () => {
    const filterParams: any = {};
    this.dataHandlerService.getRoles(filterParams).subscribe((res: any) => {
      this.roles = res.data
      // this.modules = res.data
      // this.parentModules = this.modules.filter(x => x.parentId == null);
      this.isModuleLoaded = true
    });
  }

  /**
   * handleRoleFormSubmit function.
   * @returns {*} Result.
   */
  handleRoleFormSubmit() {
    this.roleForm.submit();
  }

  /**
   * handleRoleUserFormSubmit function.
   * @returns {*} Result.
   */
  handleRoleUserFormSubmit() {
    this.roleUserForm.submit();
  }


  /**
   * onRoleFormSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  onRoleFormSubmit(data: any) {
    const payload = {
      name: data.name,
      shortName: data.shortName,
      description: data.description,
      isAvailableForDownline: data.isAvailableForDownline
    };

    if (this.isEditMode && this.selectedRoleData?.uuid) {
      this.dataHandlerService.updateRole(this.selectedRoleData.uuid, payload).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Role updated successfully');
          this.getRoles();
          this.dataService.hideAllModals();
        },
        error: (err: any) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
      });
    } else {
      this.dataHandlerService.createRole(payload).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Role created successfully');
          this.getRoles();
          this.dataService.hideAllModals();
        },
        error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
      });
    }
  }


  /**
   * onRoleUserSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  onRoleUserSubmit(data: any) {
    let finalPayload = {
      userName: data.userName,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      userId: data.userId,
      userType: 2,
      roleUid: this.selectedRole
    };

    this.dataHandlerService.createManagementUser(finalPayload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'User created successfully')
        this.getRoles()
        this.dataService.hideAllModals()
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
    })

  }

  /**
   * handleFormCancel function.
   * @returns {*} Result.
   */
  handleFormCancel() {
  }

  /**
   * toggleStatus function.
   * @param {*} role - Parameter.
   * @returns {*} Result.
   */
  toggleStatus = (role: roles) => {
  }

  // openModal = (modalId: any, roleId: any = null) => {
  //   if(roleId) this.selectedRole = roleId
  //   this.dataService.openModal(modalId)
  // }

  /**
   * openModal function.
   * @param {*} modalId - Parameter.
   * @param {*} role - Parameter.
   * @returns {*} Result.
   */
  openModal(modalId: string, role?: any) {
    if (modalId === 'roleUserModal' || modalId === 'roleFormModal') {
      if (role) {
        // Edit mode
        this.isEditMode = true;
        this.selectedRole = role;
        this.selectedRoleData = role;
      } else {
        // Create mode
        this.isEditMode = false;
        this.selectedRoleData = null;
      }
    }


    this.dataService.openModal(modalId)
  }

  /**
   * navigateToUserList function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  navigateToUserList(data: any) {
    this.router.navigate(['/role-users'], {
      queryParams: { uuid: data?.uuid }
    });
  }

  /**
   * goBack function.
   * @returns {*} Result.
   */
  goBack() {
    this.location.back();
  }
}

