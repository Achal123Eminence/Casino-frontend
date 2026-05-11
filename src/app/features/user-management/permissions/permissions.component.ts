import { Component } from '@angular/core';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { routes } from '../../../shared/routes/routes';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatahandlerService } from '../../../services/datahandler.service';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Module } from '../../../shared/model/pages.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../shared/data/data.service';

@Component({
  selector: 'app-permissions',
  imports: [CollapseHeaderComponent, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './permissions.component.html', // Using template to avoid overriding the HTML logic
  styleUrl: './permissions.component.scss',
})
export class PermissionsComponent {
  public routes = routes;
  allModules: Module[] = [];
  selectedRole: any = '';
  selectedType: any = '';
  slectedName: any = '';
  check: boolean = false;
  check1: boolean = false;
  permissionsForm!: FormGroup;
  // Define permission keys used for iterating over checkboxes in HTML
  public permissionKeys = ['read', 'write', 'update', 'delete'];
  existingRolesAndPermission : any;
  /**
   * Creates an instance of PermissionsComponent
   */
  categories: any[] = [];
  selectedCategory: string | null = null;

  constructor(
    private dataHandlerService: DatahandlerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataService
  ){
    this.route.paramMap.subscribe(params => {
      this.selectedRole = params.get('roleId');
      this.selectedType = params.get('type');
      this.slectedName = params.get('name');
      this.fetchExistingRolesAndPermission(this.selectedRole, this.selectedType);
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(){
    this.getModuleCategories();
  }

  getModuleCategories() {
    this.dataHandlerService
      .getCategory()
      .subscribe((res: any) => {
        this.categories = res.data;

        // Select ALL / first category by default
        if (this.categories?.length) {
          this.selectedCategory = this.categories[0].uuid;
          this.getAllModulesWithSubmodules();
        }
      });
  }

  /**
   * getAllModulesWithSubmodules function.
   * @returns {*} Result.
   */
  getAllModulesWithSubmodules() {
    const filterParams: any = {
      type: this.selectedType,
      uuid: this.selectedRole,
      category: this.selectedCategory,
    };
    this.dataHandlerService.getModulesWithSubmodules(filterParams).subscribe((res: any) => {
      this.allModules = res.data;
      console.log(this.allModules);

      this.buildForm();

      // Once form is built, try patching if existing permissions are already loaded
      if (this.existingRolesAndPermission) {
        this.patchExistingPermissions();
      }
    });
  }

  /**
   * buildForm function.
   * @returns {*} Result.
   */
  buildForm() {
    this.permissionsForm = this.fb.group({
      modules: this.fb.array(this.allModules.map(module => this.createModuleGroup(module)))
    });
  }

  /**
   * createModuleGroup function.
   * @param {*} module - Parameter.
   * @returns {*} Result.
   */
  createModuleGroup(module: Module): FormGroup {
    return this.fb.group({
      uuid: module.uuid,
      name: module.name,
      // Module level permissions group (used when no submodules exist)
      permissions: this.fb.group({
        read: false,
        write: false,
        update: false,
        delete: false
      }),
      submodules: this.fb.array(
        module.submodules.map(sub => this.fb.group({
          uuid: sub.uuid,
          name: sub.name,
          permissions: this.fb.group({
            read: false,
            write: false,
            update: false,
            delete: false
          })
        }))
      )
    });
  }

  get modulesArray(): FormArray {
    return this.permissionsForm.get('modules') as FormArray;
  }

  /**
   * getSubmodulesArray function.
   * @param {*} moduleIndex - Parameter.
   * @returns {*} Result.
   */
  getSubmodulesArray(moduleIndex: number): FormArray {
    return this.modulesArray.at(moduleIndex).get('submodules') as FormArray;
  }

  /**
   * getModulePermissions function.
   * @param {*} moduleIndex - Parameter.
   * @returns {*} Result.
   */
  getModulePermissions(moduleIndex: number): FormGroup {
    return this.modulesArray.at(moduleIndex).get('permissions') as FormGroup;
  }

  /**
   * getSubmodulePermissions function.
   * @param {*} moduleIndex - Parameter.
   * @param {*} subIndex - Parameter.
   * @returns {*} Result.
   */
  getSubmodulePermissions(moduleIndex: number, subIndex: number): FormGroup {
    return this.getSubmodulesArray(moduleIndex).at(subIndex).get('permissions') as FormGroup;
  }

  /**
   * onSubmit function.
   * @returns {*} Result.
   */
  onSubmit() {
    const finalPayload = this.buildRolePermissionPayload(this.permissionsForm.value.modules)
    console.log("PAYLOAD",finalPayload);

    this.dataHandlerService.updateRolePermissions(finalPayload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Default Form field updated successfully')
        this.dataService.hideAllModals();
        // this.getModuleCategories();
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
    })
  }

  /**
   * buildRolePermissionPayload function.
   * @param {*} modules - Parameter.
   * @returns {*} Result.
   */
  buildRolePermissionPayload(modules: any[]): any {
    // return {
    //   type: this.selectedType,
    //   uuid: this.selectedRole,
    //   modules: modules.map(module => {
    //     const filteredSubmodules = module.submodules.filter((sub: any) =>
    //       Object.values(sub.permissions).some(val => val === true)
    //     );
    //     const moduleHasPermission = Object.values(module.permissions).some(val => val === true);

    //     if (moduleHasPermission || filteredSubmodules.length > 0) {
    //       return {
    //         moduleUuid: module.uuid,
    //         permissions: module.permissions,
    //         submodules: filteredSubmodules
    //       };
    //     }

    //     return null;
    //   })
    //   .filter((m): m is any => m !== null)
    // }
    return {
    type: this.selectedType,
    uuid: this.selectedRole,
    category: this.selectedCategory,
    modules: modules.map(module => ({
      moduleUuid: module.uuid,
      permissions: module.permissions,
      submodules: module.submodules.map((sub: any) => ({
        uuid: sub.uuid,
        permissions: sub.permissions,
        name: sub.name
      }))
    }))
  };
  }

  /**
   * fetchExistingRolesAndPermission function.
   * @param {*} uuid - Parameter.
   * @param {*} type - Parameter.
   * @returns {*} Result.
   */
  fetchExistingRolesAndPermission(uuid: any, type: any) {
    const payload = {
      uuid,
      type
    }
    this.dataHandlerService.getRoleAndPermission(payload).subscribe({
      next: (res: any) => {
        this.existingRolesAndPermission = res.data?.permissions || [];

        // If form is already built, patch now
        if (this.permissionsForm) {
          this.patchExistingPermissions();
        }
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
    });
  }

  /**
   * patchExistingPermissions function.
   * @returns {*} Result.
   */
  patchExistingPermissions() {
    if (!this.permissionsForm || !this.existingRolesAndPermission) return;

    this.existingRolesAndPermission.forEach((perm: any) => {
      const moduleUuid = perm?.moduleId?.uuid;
      if (!moduleUuid) return;

      // matching as a module first
      const moduleIndex = this.modulesArray.controls.findIndex(
        (m: any) => m.value.uuid === moduleUuid
      );

      if (moduleIndex !== -1) {
        // Patch module-level permissions
        const moduleGroup = this.modulesArray.at(moduleIndex) as FormGroup;
        const permissionsGroup = moduleGroup.get('permissions') as FormGroup;

        if (permissionsGroup && perm.permissions) {
          this.permissionKeys.forEach(key => {
            if (perm.permissions.hasOwnProperty(key)) {
              permissionsGroup.get(key)?.setValue(perm.permissions[key]);
            }
          });
        }
      } else {
        // Not found as module → search in submodules
        this.modulesArray.controls.forEach((moduleGroup, parentIndex) => {
          const submodulesArray = this.getSubmodulesArray(parentIndex);
          const subIndex = submodulesArray.controls.findIndex(
            (s: any) => s.value.uuid === moduleUuid
          );

          if (subIndex !== -1) {
            // Patch submodule-level permissions
            const subPermissionsGroup = this.getSubmodulePermissions(parentIndex, subIndex);
            if (subPermissionsGroup && perm.permissions) {
              this.permissionKeys.forEach(key => {
                if (perm.permissions.hasOwnProperty(key)) {
                  subPermissionsGroup.get(key)?.setValue(perm.permissions[key]);
                }
              });
            }
          }
        });
      }
    });

    this.permissionsForm.updateValueAndValidity();
  }

  // --- COLUMN-WISE "SELECT ALL" LOGIC (Fixed) ---

  /**
   * isPermissionKeyAllChecked function.
   * @param {*} moduleIndex - Parameter.
   * @param {*} key - Parameter.
   * @returns {*} Result.
   */
  isPermissionKeyAllChecked(moduleIndex: number, key: string): boolean {
    const submodulesArray = this.getSubmodulesArray(moduleIndex);

    if (submodulesArray.length === 0) {
      // If no submodules, check the module-level permission
      return this.getModulePermissions(moduleIndex).get(key)?.value === true;
    }

    // Check if the specific permission key is true for EVERY submodule
    return submodulesArray.controls.every(submoduleGroup => {
      const permissionsGroup = submoduleGroup.get('permissions') as FormGroup;
      return permissionsGroup.get(key)?.value === true;
    });
  }

  /**
   * togglePermissionKeyForModule function.
   * @param {*} moduleIndex - Parameter.
   * @param {*} event - Parameter.
   * @param {*} key - Parameter.
   * @returns {*} Result.
   */
  togglePermissionKeyForModule(moduleIndex: number, event: Event, key: string): void {
    /**
     * checked function.
     * @returns {*} Result.
     */
    const checked = (event.target as HTMLInputElement).checked;

    const submodulesArray = this.getSubmodulesArray(moduleIndex);

    if (submodulesArray.length > 0) {
      // Logic for modules WITH submodules: apply to all submodules
      submodulesArray.controls.forEach(submoduleGroup => {
        const permissionsGroup = submoduleGroup.get('permissions') as FormGroup;
        permissionsGroup.get(key)?.setValue(checked);
      });
    } else {
      // Logic for modules WITHOUT submodules: apply to module level permissions
      this.getModulePermissions(moduleIndex).get(key)?.setValue(checked);
    }
  }

  // --- MODULE-LEVEL "SELECT ALL" LOGIC (Fixed) ---

  /**
   * isModuleAllChecked function.
   * @param {*} moduleIndex - Parameter.
   * @returns {*} Result.
   */
  isModuleAllChecked(moduleIndex: number): boolean {
    const submodulesArray = this.getSubmodulesArray(moduleIndex);

    if (submodulesArray.length === 0) {
        // For module-level view, check if all 4 module-level permissions are true
        const modulePermissions = this.getModulePermissions(moduleIndex).value;
        return this.permissionKeys.every(key => modulePermissions[key] === true);
    }

    // Check if EVERY submodule's row is fully checked
    return submodulesArray.controls.every((_, subIndex) => this.isRowAllChecked(moduleIndex, subIndex));
  }

  /**
   * toggleModuleAllPermissions function.
   * @param {*} moduleIndex - Parameter.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  toggleModuleAllPermissions(moduleIndex: number, event: Event): void {
    /**
     * checked function.
     * @returns {*} Result.
     */
    const checked = (event.target as HTMLInputElement).checked;

    // 1. Apply to module-level permissions (Used when no submodules)
    const modulePermissionsGroup = this.getModulePermissions(moduleIndex);
    this.permissionKeys.forEach(key => {
      modulePermissionsGroup.get(key)?.setValue(checked);
    });

    // 2. Apply to all submodules permissions
    const submodulesArray = this.getSubmodulesArray(moduleIndex);
    submodulesArray.controls.forEach(submoduleGroup => {
      const permissionsGroup = submoduleGroup.get('permissions') as FormGroup;
      this.permissionKeys.forEach(key => {
        permissionsGroup.get(key)?.setValue(checked);
      });
    });
  }

  // --- SUBMODULE-ROW "ALL" LOGIC ---

  /**
   * isRowAllChecked function.
   * @param {*} moduleIndex - Parameter.
   * @param {*} subIndex - Parameter.
   * @returns {*} Result.
   */
  isRowAllChecked(moduleIndex: number, subIndex?: number): boolean {
    if (subIndex === undefined) return false;

    const permissionsGroup = this.getSubmodulePermissions(moduleIndex, subIndex);
    const permissions = permissionsGroup.value;
    return this.permissionKeys.every(key => permissions[key] === true);
  }

  /**
   * toggleRowPermissions function.
   * @param {*} moduleIndex - Parameter.
   * @param {*} event - Parameter.
   * @param {*} subIndex - Parameter.
   * @returns {*} Result.
   */
  toggleRowPermissions(moduleIndex: number, event: Event, subIndex?: number): void {
    if (subIndex === undefined) return;

    /**
     * checked function.
     * @returns {*} Result.
     */
    const checked = (event.target as HTMLInputElement).checked;
    const permissionsGroup = this.getSubmodulePermissions(moduleIndex, subIndex);

    this.permissionKeys.forEach(key => {
        permissionsGroup.get(key)?.setValue(checked);
    });

    // When toggling a row, the module's header "Select All" may change
    this.updateModuleHeaderAllCheckbox(moduleIndex);
  }

  // --- HELPER TO KEEP HEADER CHECKBOXES IN SYNC ---
  /**
   * updateModuleHeaderAllCheckbox function.
   * @param {*} moduleIndex - Parameter.
   * @returns {*} Result.
   */
  private updateModuleHeaderAllCheckbox(moduleIndex: number): void {
    // This function forces Angular to re-evaluate the checked state of the header's checkboxes
    // by triggering a change detection cycle for the required bindings.
    // In many modern Angular setups, calling `updateValueAndValidity()` on the FormArray
    // or relying on Angular's default change detection will be sufficient, but we can ensure
    // the UI updates by just letting the template re-check the methods on the next cycle.
  }

  // Placeholder functions from previous version - retained for compatibility
  /**
   * selectAll function.
   * @returns {*} Result.
   */
  selectAll(): void { /* Logic moved to form-driven methods */ }
  /**
   * selectAll1 function.
   * @returns {*} Result.
   */
  selectAll1(): void { /* Logic moved to form-driven methods */ }
}
