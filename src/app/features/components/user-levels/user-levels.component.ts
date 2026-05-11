import { Component, ViewChild } from '@angular/core';
import { DatahandlerService } from '../../../services/datahandler.service';
import { userLevels } from '../../../shared/model/pages.model';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { routes } from '../../../shared/routes/routes';
import { pageSelection, formFields } from '../../../shared/model/pages.model';
import { PaginationService } from '../../../shared/custom-pagination/pagination.service';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SideFormModalComponent } from '../../../shared/common/side-form-modal/side-form-modal.component';
import { UserLevelFormComponent } from '../forms/user-level-form/user-level-form.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from "../../../shared/data/data.service"
import { CommonFormModalComponent } from '../../../shared/common/common-form-modal/common-form-modal.component';
import { RechargeComponent } from '../forms/recharge/recharge.component';
import { LevelDefaultFieldsComponent } from '../forms/level-default-fields/level-default-fields.component';
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-levels',
  imports: [
    CommonModule,
    RouterLink,
    CustomPaginationComponent,
    CollapseHeaderComponent,
    SideFormModalComponent,
    UserLevelFormComponent,
    CommonFormModalComponent,
    RechargeComponent,
    LevelDefaultFieldsComponent
  ],
  templateUrl: './user-levels.component.html',
  styleUrl: './user-levels.component.scss'
})

export class UserLevelsComponent {
  @ViewChild('updateLevelDefaultForm') updateLevelDefaultForm!: LevelDefaultFieldsComponent;
  userLevels: userLevels[] = [];
  formFields: formFields[] = [];
  formFieldLoaded: boolean = false
  routes = routes;
  selectedLevelFormFields: any = [];
  isEditMode: boolean = false;
  selectedLevelData: any = null;

  selectedLevel: userLevels = {
    level: 0,
    title: '',
    uuid: '',
    shortName: '',
    canUserBeCreated : true
  };
  constructor(
    private dataHandlerService: DatahandlerService,
    private toastr: ToastrService,
    private dataService: DataService,
    private location: Location,
    public auth: AuthService
  ){}

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() {
    this.getFormFields()
    this.getUserLevels()
  }

  /**
   * getUserLevels function.
   * @returns {*} Result.
   */
  getUserLevels = () => {
    const filterParams: any = {};
    this.dataHandlerService.getUserLevels(filterParams).subscribe((res: any) => {
      this.userLevels = res?.data || [];
    });
  }

  /**
   * getFormFields function.
   * @returns {*} Result.
   */
  getFormFields = () => {
    const filterParams: any = {};
    this.dataHandlerService.getFormFields(filterParams).subscribe((res: any) => {
      this.formFields = res?.data.fields || [];
      this.formFieldLoaded = true;
    });
  }

  /**
   * handleFormSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  handleFormSubmit(data: any) {
    if (this.isEditMode && this.selectedLevelData?.uuid) {
      const payload = {
        shortName: data.shortName,
        title: data.title,
        canUserBeCreated : data.canUserBeCreated
      }
      this.dataHandlerService.updateUserLevel(this.selectedLevelData.uuid, payload).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Level updated successfully');
          this.getUserLevels();
          this.closeSideForm();

        },
        error: (err:any) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
      });
    } else {
      this.dataHandlerService.createUserLevel(data).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Level created successfully');
          this.getUserLevels();
          this.closeSideForm();

        },
        error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
      });
    }
  }

  /**
   * handleLevelFormSubmit function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  handleLevelFormSubmit(data: any) {
    const userLevelUuid = data.userLevelUuid;

    const filteredFormFields = data.fields
    .filter((field: any) => field.isEnabled)
    .map((field:any) => ({
      formFieldUuid: field.formFieldUuid,
      isEnabled: field.isEnabled,
      isRequired: field.isRequired,
      order: field.order
    }));

    const finalPayload = {
      userLevelUuid,
      formFields: filteredFormFields
    };

    this.dataHandlerService.updateDefaultLevelFormFields(finalPayload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Default Form field updated successfully')
        this.dataService.hideAllModals()
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
    })
  }

  /**
   * handleLevelDefaultFormSubmit function.
   * @returns {*} Result.
   */
  handleLevelDefaultFormSubmit() {
    this.updateLevelDefaultForm.submit();
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
   * @param {*} levelInfo - Parameter.
   * @returns {*} Result.
   */
  openModal = (modalId: any, levelInfo: userLevels) => {
    this.selectedLevel = levelInfo;
    this.dataHandlerService.getFormByLevel(levelInfo.uuid).subscribe({
      next: (res: any) => {
        this.selectedLevelFormFields = res.data
        this.dataService.openModal(modalId)
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Something went wrong', 'Error')
    });
  }

  /**
   * openForm function.
   * @param {*} level - Parameter.
   * @returns {*} Result.
   */
  openForm(level?: any) {
    if (level) {
      this.isEditMode = true;
      this.selectedLevelData = level;
    } else {
      this.isEditMode = false;
      this.selectedLevelData = null;
    }

    const offcanvas = document.getElementById('addLevelForm');
    if (offcanvas) {
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
      bsOffcanvas.show();
    }
  }

  /**
   * closeSideForm function.
   * @returns {*} Result.
   */
  closeSideForm() {
    const offcanvas = document.getElementById('addLevelForm');
    if (offcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
      bsOffcanvas?.hide();
    }
  }
  /**
   * goBack function.
   * @returns {*} Result.
   */
  goBack() {
    this.location.back();
  }

}
