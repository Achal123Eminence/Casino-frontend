import { Component, ViewChild } from '@angular/core';
import { DatahandlerService } from '../../../services/datahandler.service';
import { modules, formFields } from '../../../shared/model/pages.model';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { routes } from '../../../shared/routes/routes';
import { PaginationService } from '../../../shared/custom-pagination/pagination.service';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SideFormModalComponent } from '../../../shared/common/side-form-modal/side-form-modal.component';
import { UserLevelFormComponent } from '../forms/user-level-form/user-level-form.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from "../../../shared/data/data.service"
import { CommonFormModalComponent } from '../../../shared/common/common-form-modal/common-form-modal.component';
import { ModuleComponent } from '../forms/module/module.component';
import { AuthService } from '../../../services/auth.service';
import { fi } from 'intl-tel-input/i18n';
import { AddCategoryModuleComponent } from "../forms/add-category-module/add-category-module.component";

@Component({
  selector: 'app-modules',
  imports: [
    CommonModule,
    RouterLink,
    CustomPaginationComponent,
    CollapseHeaderComponent,
    SideFormModalComponent,
    UserLevelFormComponent,
    CommonFormModalComponent,
    ModuleComponent,
    AddCategoryModuleComponent
  ],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss'
})

export class ModulesComponent {
  @ViewChild('addModuleForm') addModuleForm!: ModuleComponent;
  modules: any[] = [];
  formFields: formFields[] = [];
  formFieldLoaded: boolean = false
  routes = routes;
  parentModules: modules[] = [];
  isModuleLoaded: boolean = false;
  categories: any[] = [];
  moduleData: any = null;
  selectedCategory: any;
  categoryData: any = null;
  @ViewChild('categoryForm') addCategoryForm!: AddCategoryModuleComponent;

  constructor(
    private dataHandlerService: DatahandlerService,
    private toastr: ToastrService,
    private dataService: DataService,
    private location: Location,
    private api: DatahandlerService,
    public auth: AuthService
  ) { }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() {
    this.getCategory();
  }

  /**
   * getModules function.
   * @returns {*} Result.
   */
  getModules = (selectedCategory: string) => {
    const filterParams: any = { category: selectedCategory };
    this.dataHandlerService.getModules(filterParams).subscribe((res: any) => {
      const allModules = res.data;
      console.log(allModules);

      this.modules = this.groupModules(allModules);

      this.parentModules = this.modules.filter(x => x.parentId == null);
      this.isModuleLoaded = true
    });
  }

  // groupModules(modules: any[]) {
  //   const parents = modules.filter((m) => !m.parentId);

  //   return parents.map((parent) => {
  //     const children = modules.filter((m) => m.parentId === parent.uuid);
  //     return {
  //       ...parent,
  //       children
  //     };
  //   });
  // }

  groupModules(modules: any[]) {
    const moduleMap = new Map();

    modules.forEach(m => {
      moduleMap.set(m.uuid, { ...m, children: [] });
    });

    const tree: any[] = [];

    modules.forEach(m => {
      if (m.parentId && moduleMap.has(m.parentId)) {
        moduleMap.get(m.parentId).children.push(moduleMap.get(m.uuid));
      } else {
        tree.push(moduleMap.get(m.uuid));
      }
    });

    return tree;
  }

  /**
   * handleModuleFormSubmit function.
   * @returns {*} Result.
   */
  handleModuleFormSubmit() {
    this.addModuleForm.submit();
  }

  addModule(data: any) {
    this.dataHandlerService.addModule(data).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Module created successfully')
        this.dataService.hideAllModals()
        this.getModules(this.selectedCategory);
        this.moduleData = null;
        this.addModuleForm.reset();
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
    })
  }

  updateModule(data: any) {
    this.dataHandlerService.updateModule(data.finalPayload, data.uuid).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Module created successfully')
        this.dataService.hideAllModals()
        this.getModules(this.selectedCategory);
        this.moduleData = null;
        this.addModuleForm.reset();
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
    })
  }

  /**
   * onModuleFormSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  onModuleFormSubmit(data: any) {
    let finalPayload = {
      name: data.name,
      shortName: data.shortName,
      category: data.category.map((cat: any) => cat.uuid)
    };
    if (data.parentId)
      finalPayload = { ...finalPayload, ...{ parentUuid: data.parentId } }

    if (this.moduleData) {
      const payload = { finalPayload, uuid: this.moduleData.uuid };
      this.updateModule(payload)
    } else {
      this.addModule(finalPayload);
    }
  }

  /**
   * handleFormCancel function.
   * @returns {*} Result.
   */
  handleFormCancel() {
    this.moduleData = null;
    this.addModuleForm.reset();
  }

  /**
   * toggleStatus function.
   * @param {*} module - Parameter.
   * @returns {*} Result.
   */
  toggleStatus = (module: modules) => {
  }

  /**
   * openModal function.
   * @param {*} modalId - Parameter.
   * @returns {*} Result.
   */
  openModal = (modalId: any) => {
    this.dataService.openModal(modalId)
  }
  /**
   * goBack function.
   * @returns {*} Result.
   */
  goBack() {
    this.location.back();
  }

  getCategory() {
    this.api.getCategory().subscribe({
      next: (res: any) => {
        this.categories = res.data.map((item: any) => ({ name: item.name, uuid: item.uuid }));
        this.selectedCategory = res?.data[0].uuid;
        this.getModules(this.selectedCategory);
      },
    });
  }

  updateStatus(data: any) {
    const finalPayload: any = {
      status: (data.status) ? 0 : 1
    }
    const payload = { finalPayload, uuid: data.uuid };
    this.updateModule(payload)
  }

  getCategoryName(data: string[]): string {
    data = data.map((ele: any) => ele.name);
    return data?.join(', ') || '';
  }

  openEditModule(data: any) {
    this.moduleData = { ...data };
    this.dataService.openModal('moduleFormModal');
  }

  addCategory(data: any) {
    this.api.addCategory(data).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Module category created successfully')
        this.dataService.hideAllModals()
        this.getCategory();
        this.categoryData = null;
        this.addCategoryForm.reset();
      },
    });
  }

  handleCategoryModuleFormSubmit() {
    this.addCategoryForm.submit();
  }

  handleCategoryFormCancel() {
    this.dataService.hideAllModals();
    this.categoryData = null;
    this.addCategoryForm.reset();
  }

  onCategoryFormSubmit(data: any) {
    if (this.categoryData) {
      // this.updateCategory({...data, uuid: this.categoryData.uuid})
    } else {
      this.addCategory(data);
    }
  }

}
