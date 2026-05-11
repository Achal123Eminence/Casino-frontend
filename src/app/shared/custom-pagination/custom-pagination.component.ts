import { Component } from '@angular/core';
import {
  pageSelection,
  pageSize,
  pageSizeCal,
  PaginationService,
} from './pagination.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-custom-pagination',
    templateUrl: './custom-pagination.component.html',
    styleUrl: './custom-pagination.component.scss',
     imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CustomPaginationComponent {
  public pageSize = 10;
  public tableData: string[] = [];
  // pagination variables
  public lastIndex = 0;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: number[] = [];
  public currentPage = 1;
  public pageNumberArray: number[] = [];
  public pageSelection: pageSelection[] = [];
  public totalPages = 0;
  //** / pagination variables

  /**
   * constructor function.
   * @param {*} pagination - Parameter.
   * @returns {*} Result.
   */
  constructor(private pagination: PaginationService) {
    this.tableData = [];
    this.pagination.tablePageSize.subscribe((res) => {
      this.skip = res.skip;
      this.limit = res.limit;
      this.pageSize = res.pageSize;
      this.currentPage = Math.floor(res.skip / res.pageSize) + 1;
      this.pageIndex = this.currentPage - 1;
    });
    this.pagination.calculatePageSize.subscribe((res: pageSizeCal) => {
      this.calculateTotalPages(
        res.totalData,
        res.pageSize,
        res.tableData,
        res.serialNumberArray
      );
      this.pageSize = res.pageSize;
    });
    this.pagination.changePagesize.subscribe((res: pageSize) => {
      this.changePageSize(res.pageSize);
    });
  }

   

  /**
   * getMoreData function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit = this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      // this.getTableData();
      this.pagination.tablePageSize.next({
        skip: this.skip,
        limit: this.limit,
        pageSize: this.pageSize,
      });
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit = this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      // this.getTableData();
      this.pagination.tablePageSize.next({
        skip: this.skip,
        limit: this.limit,
        pageSize: this.pageSize,
      });
    }
  }

  /**
   * moveToPage function.
   * @param {*} pageNumber - Parameter.
   * @returns {*} Result.
   */
  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.pageIndex = pageNumber - 1;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    // this.getTableData();
    this.pagination.tablePageSize.next({
      skip: this.skip,
      limit: this.limit,
      pageSize: this.pageSize,
    });
  }

  /**
   * changePageSize function.
   * @param {*} pageSize - Parameter.
   * @returns {*} Result.
   */
  public changePageSize(pageSize: number): void {
    this.pageSelection = [];
    this.pageSize = pageSize;
    this.limit = pageSize;
    this.skip = 0;
    this.currentPage = 1;
    // this.getTableData();
    this.pagination.tablePageSize.next({
      skip: this.skip,
      limit: this.limit,
      pageSize: this.pageSize,
    });
  }

  /**
   * calculateTotalPages function.
   * @param {*} totalData - Parameter.
   * @param {*} pageSize - Parameter.
   * @param {*} tableData - Parameter.
   * @param {*} serialNumberArray - Parameter.
   * @returns {*} Result.
   */
  public calculateTotalPages(
    totalData: number,
    pageSize: number,
    tableData: string[],
    serialNumberArray: number[]
  ): void {
    this.tableData = tableData;
    this.pageNumberArray = [];
    this.pageSelection = [];
    this.serialNumberArray = serialNumberArray;
    this.totalData = totalData;
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const skip = pageSize * (i - 1);
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip, limit: pageSize });
    }
  }
}
