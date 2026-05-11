import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CollapseHeaderComponent } from '../../common/collapse-header/collapse-header.component';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from '../../../shared/routes/routes';
import { apiResultFormat, pageSelection, manageUsers } from '../../../shared/model/pages.model';
import { PaginationService, tablePageSize } from '../../../shared/custom-pagination/pagination.service';
import { DataService } from '../../../shared/data/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DateRangePickerComponent } from '../../common/date-range-picker/date-range-picker.component';
import { AuthService } from "../../../services/auth.service";
import { DatahandlerService } from '../../../services/datahandler.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addform-fields',
  imports: [CommonModule,
    RouterLink,
    NgxEditorModule,
    MatSelectModule,
    FormsModule,
    BsDatepickerModule,
    MatChipsModule,
    MatIconModule,
    CustomPaginationComponent,
    MatSort,
    DateRangePickerComponent,
    CollapseHeaderComponent,
    ReactiveFormsModule,
    MatSortModule],
  templateUrl: './addform-fields.component.html',
  styleUrl: './addform-fields.component.scss'
})
export class AddformFieldsComponent {
  public routes = routes;
  // pagination variables
  public tableData: manageUsers[] = [];
  public pageSize = 10;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<manageUsers>;
  public searchDataValue = '';
  public tableDataCopy: manageUsers[] = [];
  public actualData: manageUsers[] = [];
  user: any;
  errorMessage!: string;
  fieldForm!: FormGroup
  public sidebarPopup = false;
  public sidebarPopup2 = false;
  public password: boolean[] = [false];
  levelsList: [] = []
  initChecked = false;
  configForm!: FormGroup;
  userLevels: any[] = [];       // <-- Dropdown options from API
  formFieldsList: any[] = [];   // <-
  /**
   * togglePassword function.
   * @param {*} index - Parameter.
   * @returns {*} Result.
   */
  public togglePassword(index: number) {
    this.password[index] = !this.password[index]
  }

  existingFormFields: any[] = [];

  /**
   * onClickStar function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  onClickStar(item: manageUsers) {
    item.isStarActive = !item.isStarActive;
  }


  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private dataserve: DatahandlerService,
    private fb: FormBuilder,
    private toastr: ToastrService

  ) {
    // this.data.getManagementUser().subscribe((apiRes: any) => {
    //   console.log(apiRes)
    //   // this.actualData = apiRes.data;
    //   // this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
    //   //   if (this.router.url == this.routes.manageUsers) {
    //   //     this.getTableData({ skip: res.skip, limit: res.limit });
    //   //     this.pageSize = res.pageSize;
    //   //   }
    //   // });
    // });
  }


  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
      this.getUserLevels();
      this.loadFormFields();
    });

    this.configForm = this.fb.group({
      userLevelUuid: ['', Validators.required],
      formFields: this.fb.array([])
    });
  }

  /**
   * getTableData function.
   * @param {*} pageOption - Parameter.
   * @returns {*} Result.
   */
  private getTableData(pageOption: pageSelection): void {
    this.data.getManageUsers().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.tableDataCopy = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: manageUsers, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.id = serialNumber;
          this.tableData.push(res);
          this.serialNumberArray.push(serialNumber);
          this.tableDataCopy.push(res);
        }
      });
      this.dataSource = new MatTableDataSource<manageUsers>(this.actualData);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        tableDataCopy: this.tableDataCopy,
        serialNumberArray: this.serialNumberArray,
      });
    });
  }

  /**
   * sortData function.
   * @param {*} sort - Parameter.
   * @returns {*} Result.
   */
  public sortData(sort: Sort) {
    const data = this.tableData.slice();
    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
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
  public row = true;
  /**
   * searchData function.
   * @param {*} value - Parameter.
   * @returns {*} Result.
   */
  public searchData(value: string): void {
    this.searchDataValue = value.trim().toLowerCase();
    this.dataSource.filter = this.searchDataValue;
    this.tableData = this.dataSource.filteredData;
    this.row = this.tableData.length > 0;

    if (this.searchDataValue !== '') {
      // Handle filtered data
      this.pagination.calculatePageSize.next({
        totalData: this.tableData.length,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.tableData.map((_, i) => i + 1),
      });
    } else {
      // Handle reset to full data
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.serialNumberArray,
      });
    }
  }

  /**
   * selectAll function.
   * @param {*} initChecked - Parameter.
   * @returns {*} Result.
   */
  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
  }

  //fetch all user levels
  /**
   * getUserLevels function.
   * @returns {*} Result.
   */
  getUserLevels() {
    const filterParams: any = {};
    this.dataserve.getUserLevels(filterParams).subscribe((res: any) => {
      this.userLevels = res?.data || [];
    });
  }

  get formFieldsArray(): FormArray {
    return this.configForm.get('formFields') as FormArray;
  }

  /**
   * loadFormFields function.
   * @returns {*} Result.
   */
  loadFormFields() {
    this.dataserve.getFormFields().subscribe((res: any) => {
      this.formFieldsList = res?.data || [];
      // build form array dynamically
      this.formFieldsList.forEach((field: any, index: number) => {
        this.formFieldsArray.push(
          this.fb.group({
            formFieldUuid: [field.label, Validators.required],
            isRequired: [field.isRequired ?? false],
            isEnabled: [field.isEnabled ?? true],
            order: [index + 1, Validators.required]
          })
        );
      });
    });

  }

  /**
   * onSubmit function.
   * @returns {*} Result.
   */
  onSubmit() {
    if (this.configForm.valid) {
      const payload = this.configForm.value;
      this.dataserve.updateDefaultLevelFormFields(payload).subscribe({
        next: (res: any) => {
          this.toastr.success('Success', `${res.message}`);
          this.fieldForm.reset({
            inputType: 'textbox'
          });
        },
        error: (err: any) => {
          this.errorMessage = err.error.message || 'Error occurred';
          this.toastr.error('Error', this.errorMessage);
        }
      });


      this.configForm.reset();
      this.formFieldsArray.clear();
    } else {
      this.configForm.markAllAsTouched();
    }
  }

  /**
   * onUserLevelChange function.
   * @param {*} uuid - Parameter.
   * @returns {*} Result.
   */
  onUserLevelChange(uuid: string) {
    if (!uuid) {
      this.existingFormFields = [];
      return;
    }


    this.dataserve.getFormByLevel(uuid).subscribe({
      next: (res: any) => {
        this.existingFormFields = (res?.data || []).sort((a: any, b: any) => a.order - b.order);
      },
      error: (err) => {
        console.error("Error loading form fields:", err);
        this.existingFormFields = [];
      }
    });
  }


}