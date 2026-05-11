import { Component, ViewChild } from '@angular/core';
import { CommonFormModalComponent } from "../../../../shared/common/common-form-modal/common-form-modal.component";
import { AddCategoryModuleComponent } from "../../forms/add-category-module/add-category-module.component";
import { CustomPaginationComponent } from "../../../../shared/custom-pagination/custom-pagination.component";
import { CollapseHeaderComponent } from "../../../common/collapse-header/collapse-header.component";
import { DatahandlerService } from '../../../../services/datahandler.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../../shared/data/data.service';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { routes } from '../../../../shared/routes/routes';
import { RouterLink } from '@angular/router';
import { ca } from 'intl-tel-input/i18n';

@Component({
  selector: 'app-category',
  imports: [CommonFormModalComponent, AddCategoryModuleComponent, CustomPaginationComponent, CollapseHeaderComponent, CommonModule,
    RouterLink,],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  @ViewChild('addCategoryForm') addCategoryForm!: AddCategoryModuleComponent;
  formFieldLoaded: boolean = false
  routes = routes;
  categories: any[] = [];
  categoryData: any = {};

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
   * handleFormCancel function.
   * @returns {*} Result.
   */
  handleFormCancel() {
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

  handleCategoryModuleFormSubmit() {
    this.addCategoryForm.submit();
  }

  handleCategoryFormCancel() {
    this.dataService.hideAllModals();
    this.categoryData= null;
    this.addCategoryForm.reset();
  }

  addCategory(data: any) {
    this.api.addCategory(data).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Module category created successfully')
        this.dataService.hideAllModals()
        this.getCategory();
        this.categoryData= null;
        this.addCategoryForm.reset();
      },
    });
  }

  updateCategory(data: any) {
    this.api.updateCategory(data).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Module category updated successfully')
        this.dataService.hideAllModals()
        this.getCategory();
        this.categoryData= null;
        this.addCategoryForm.reset();
      },
    });
  }



  onCategoryFormSubmit(data: any) {
    if(this.categoryData){
      this.updateCategory({...data, uuid: this.categoryData.uuid})
    } else {
      this.addCategory(data);
    }
  }

  getCategory() {
    this.api.getCategory().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      },
    });
  }

  openEditCategory(category: any) {
    this.categoryData = { ...category };
    this.dataService.openModal('moduleCategoryFormModal');
  }

}
