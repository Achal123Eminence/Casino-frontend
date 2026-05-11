import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from '../../../shared/routes/routes';
import { pageSelection, formFields } from '../../../shared/model/pages.model';
import { PaginationService } from '../../../shared/custom-pagination/pagination.service';
import { DataService } from '../../../shared/data/data.service';
import { AuthService } from "../../../services/auth.service";
import { ToastrService } from 'ngx-toastr';
import { DatahandlerService } from '../../../services/datahandler.service';
import { ExportDropdownComponent } from "../../../shared/common/export-dropdown/export-dropdown.component";
import { ConfirmModalComponent } from '../../../shared/common/confirm-modal/confirm-modal.component';

declare const bootstrap: any;
@Component({
  selector: 'app-form-fields',
  imports: [
    CommonModule,
    RouterLink,
    MatSelectModule,
    FormsModule,
    CustomPaginationComponent,
    CollapseHeaderComponent,
    ReactiveFormsModule,
    ExportDropdownComponent,
    ConfirmModalComponent
],
  templateUrl: './form-fields.component.html',
  styleUrl: './form-fields.component.scss'
})
export class FormFieldsComponent {
  public routes = routes;
  // pagination variables
  public tableData: formFields[] = [];
  public pageSize = 10;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<formFields>;
  public searchDataValue = '';

  user: any;
  errorMessage!: string;
  fieldForm!: FormGroup
  public sidebarPopup = false;
  public sidebarPopup2 = false;
  public password: boolean[] = [false];

  initChecked = false;

  download: any = '';
  downloadType: any = '';
  downloadData: any[] = [];
  fileName = 'Form Field Report';
  isEditMode = false;
  selectedFieldUuid: string | null = null;
  selectedFieldForStatus: any = null;
  modalTitle = 'Confirm';
  modalMessage = 'Are you sure?';

  /**
   * togglePassword function.
   * @param {*} index - Parameter.
   * @returns {*} Result.
   */
  public togglePassword(index: number) {
    this.password[index] = !this.password[index]
  }

  constructor(
    private dataService: DatahandlerService,
    private pagination: PaginationService,
    public authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private location: Location
  ) {}


  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
    });
    this.fieldForm = this.fb.group({
      name: ['', Validators.required],
      label: ['', Validators.required],
      inputType: ['textbox', Validators.required],
      minLength: [null],
      maxLength: [null],
      placeholder: [''],
      regex: [''],
      requiredMsg: [''],
      minLengthMsg: [''],
      maxLengthMsg: [''],
      regexMsg: ['']
    });
    this.getTableData({skip: 0, limit: 100})
  }

/**
 * getTableData function.
 * @param {*} queryParams - Parameter.
 * @returns {*} Result.
 */
private getTableData(queryParams: any): void {
  this.dataService.getFormFields(queryParams).subscribe({
    next: (res: any) => {
      this.tableData = res?.data?.fields || [];
      this.totalData = res?.data?.count || 0;

      if (this.download) {
        this.downloadData = this.tableData.map((item: any, index: number) => ({
          "S.No": index + 1,
          "Name": item.name || "-",
          "Placeholder": item.placeholder || "-",
          "Min Length": item.minLength ?? "-",
          "Max Length": item.maxLength ?? "-",
          "Label": item.label || "-",
          "Required": item.required ? "Yes" : "No",
          "Status": item.status == "1" ? "Active" : "Inactive",
        }));
        this.download = false;
      }
    },
    error: (err) => {
      this.toastr.error(err?.message || "Something went wrong", "Error");
    }
  });
}

  /**
   * searchData function.
   * @param {*} value - Parameter.
   * @returns {*} Result.
   */
  searchData(value: string): void {

  }

  /**
   * confirmStatusChange function.
   * @param {*} event - Parameter.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  confirmStatusChange = (event: any, item: any) => {
    event.preventDefault();
    this.selectedFieldForStatus = item;
    const nextStatus = item.status == '1' ? 0 : 1;
    this.modalTitle = nextStatus ? 'Enable Field' : 'Disable Field';
    this.modalMessage = `Are you sure you want to ${nextStatus ? 'enable' : 'disable'} field ${item.name}?`;
    const modalElement = document.getElementById('changeFormFieldStatus');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * onSubmit function.
   * @returns {*} Result.
   */
  onSubmit() {
    if (this.fieldForm.valid) {
      const formValue = this.fieldForm.value;
      const payload = {
        name: formValue.name,
        label: formValue.label,
        inputType: formValue.inputType,
        minLength: formValue.minLength,
        maxLength: formValue.maxLength,
        placeholder: formValue.placeholder,
        regex: formValue.regex,
        errorMessages: {
          required: formValue.requiredMsg,
          minLength: formValue.minLengthMsg,
          maxLength: formValue.maxLengthMsg,
          regex: formValue.regexMsg
        }
      };
      const request$ = this.isEditMode && this.selectedFieldUuid
        ? this.dataService.updateFormFields(this.selectedFieldUuid, payload)
        : this.dataService.createFormFields(payload);

      request$.subscribe({
        next: (res:any) => {
          this.toastr.success('Success', `${res.message || 'Field saved successfully'}`);
          this.fieldForm.reset({
            inputType: 'textbox'
          });
          this.isEditMode = false;
          this.selectedFieldUuid = null;
          this.getTableData({skip: 0, limit: 100});
          this.closeOffcanvas();
        },
        error: (err: any) => {
          this.errorMessage = err.error.message || 'Error occurred';
          this.toastr.error('Error', this.errorMessage);
        }
      });

    } else {
      this.fieldForm.markAllAsTouched();
    }
  }

  /**
   * openAddForm function.
   * @returns {*} Result.
   */
  openAddForm(): void {
    this.isEditMode = false;
    this.selectedFieldUuid = null;
    this.fieldForm.reset({
      inputType: 'textbox'
    });
  }

  /**
   * openEditForm function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  openEditForm(item: any): void {
    this.isEditMode = true;
    this.selectedFieldUuid = item.uuid;
    this.fieldForm.patchValue({
      name: item.name || '',
      label: item.label || '',
      inputType: item.inputType || 'textbox',
      minLength: item.minLength ?? null,
      maxLength: item.maxLength ?? null,
      placeholder: item.placeholder || '',
      regex: item.regex || '',
      requiredMsg: item.errorMessages?.required || '',
      minLengthMsg: item.errorMessages?.minLength || '',
      maxLengthMsg: item.errorMessages?.maxLength || '',
      regexMsg: item.errorMessages?.regex || ''
    });
  }

  /**
   * confirmStatusUpdate function.
   * @returns {*} Result.
   */
  confirmStatusUpdate(): void {
    if (!this.selectedFieldForStatus?.uuid) {
      return;
    }
    const nextStatus = this.selectedFieldForStatus.status == '1' ? 0 : 1;
    this.dataService.updateFormFieldStatus({
      uuid: this.selectedFieldForStatus.uuid,
      status: nextStatus
    }).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Status updated successfully', 'Success');
        this.selectedFieldForStatus.status = String(nextStatus);
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update status', 'Error');
      },
      complete: () => {
        this.selectedFieldForStatus = null;
      }
    });
  }

  /**
   * closeOffcanvas function.
   * @returns {*} Result.
   */
  closeOffcanvas(): void {
    const element = document.getElementById('offcanvas_add');
    if (!element) {
      return;
    }
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(element);
    offcanvas.hide();
    setTimeout(() => {
      const backdrops = document.querySelectorAll('.offcanvas-backdrop');
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove('offcanvas-backdrop', 'show');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }, 150);
  }

/**
 * onExportRequest function.
 * @param {*} type - Parameter.
 * @returns {*} Result.
 */
onExportRequest(type: 'pdf' | 'xls') {
  this.download = true;
  this.downloadType = type;
  this.getTableData({ skip: 0, limit: 100 });
}

  /**
   * goBack function.
   * @returns {*} Result.
   */
  goBack() {
    this.location.back();
  }

}
