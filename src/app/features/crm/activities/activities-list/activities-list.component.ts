import { Component } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { apiResultFormat, activitiesList, pageSelection } from '../../../../shared/model/pages.model';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../shared/data/data.service';
import { PaginationService, tablePageSize } from '../../../../shared/custom-pagination/pagination.service';
import { Router, RouterLink } from '@angular/router';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomPaginationComponent } from '../../../../shared/custom-pagination/custom-pagination.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePickerModule } from 'primeng/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';

@Component({
  selector: 'app-activities-list',
  imports: [CommonModule,FormsModule,RouterLink,MatSortModule,CustomPaginationComponent,BsDatepickerModule,DatePickerModule,MatSelectModule,MatIconModule,MatChipsModule,NgxEditorModule,CollapseHeaderComponent],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss'
})
export class ActivitiesListComponent {
  public routes = routes;
  time2: Date[] | undefined; 
  
  // pagination variables
  public tableData: activitiesList[] = [];
  public pageSize = 10;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<activitiesList>;
  public searchDataValue = '';
  public tableDataCopy: activitiesList[] = [];
  public actualData: activitiesList[] = [];
  //** pagination variables
  
  public sidebarPopup = false;
  public sidebarPopup2 = false;
  initChecked = false;
  text: string | undefined;

  mytime: Date = new Date();
  showTimepicker = false;

  /**
   * toggleTimepicker function.
   * @returns {*} Result.
   */
  toggleTimepicker() {
    this.showTimepicker = !this.showTimepicker;
  }

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  selectedOption1: any;
  selectedOption2: any;

  /**
   * constructor function.
   * @param {*} data - Parameter.
   * @param {*} pagination - Parameter.
   * @param {*} router - Parameter.
   * @returns {*} Result.
   */
  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router
  ) {
    this.data.getActivitiesList().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.activitiesList) {
          this.getTableData({ skip: res.skip, limit: res.limit });
          this.pageSize = res.pageSize;
        }
      });
    });
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  /**
   * getTableData function.
   * @param {*} pageOption - Parameter.
   * @returns {*} Result.
   */
  private getTableData(pageOption: pageSelection): void {
    this.data.getActivitiesList().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.tableDataCopy = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: activitiesList, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.id = serialNumber;
          this.tableData.push(res);
          this.serialNumberArray.push(serialNumber);
          this.tableDataCopy.push(res);
        }
      });
      this.dataSource = new MatTableDataSource<activitiesList>(this.actualData);
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
public row=true;
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



  option2 = [
    {
      id: 1,
      name: 'Darlee Robertson',
      image: 'assets/img/profiles/avatar-19.jpg',
    },
    { id: 2, name: 'Sharon Roy', image: 'assets/img/profiles/avatar-20.jpg' },
    { id: 3, name: 'Vaughan', image: 'assets/img/profiles/avatar-21.jpg' },
    { id: 4, name: 'Jessica', image: 'assets/img/profiles/avatar-23.jpg' },
    { id: 5, name: 'Carol Thomas', image: 'assets/img/profiles/avatar-16.jpg' },
  ];

  /**
   * removeOption2 function.
   * @param {*} user - Parameter.
   * @returns {*} Result.
   */
  removeOption2(user: any) {
    const index = this.selectedOption1.indexOf(user);
    if (index !== -1) {
      this.selectedOption1.splice(index, 1);
    }
  }
  editor!: Editor;
  editor1!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
    ['link'],
  ];
  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.editor = new Editor();
    this.editor1 = new Editor();
  }
  /**
   * ngOnDestroy function.
   * @returns {*} Result.
   */
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor1.destroy();
  }
}
