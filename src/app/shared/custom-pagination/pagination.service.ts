/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  tablePageSize: BehaviorSubject<tablePageSize> =
    new BehaviorSubject<tablePageSize>({ skip: 0, limit: 10, pageSize: 10 });

  calculatePageSize: BehaviorSubject<pageSizeCal> =
    new BehaviorSubject<pageSizeCal>({
      totalData: 0,
      pageSize: 10,
      tableData: [],
      tableDataCopy: [],
      serialNumberArray: [],
    });
  changePagesize: BehaviorSubject<pageSize> = new BehaviorSubject<pageSize>({
    pageSize: 10,
  });

  /**
   * getPageState function.
   * @returns {tablePageSize} Result.
   */
  getPageState(): tablePageSize {
    return this.tablePageSize.value;
  }

  /**
   * setPageState function.
   * @param {tablePageSize} state - Current pagination state.
   * @returns {void} Result.
   */
  setPageState(state: tablePageSize): void {
    this.tablePageSize.next(state);
  }

  /**
   * reset function.
   * @param {number} [pageSize=this.tablePageSize.value.pageSize] - Current page size.
   * @returns {void} Result.
   */
  reset(pageSize = this.tablePageSize.value.pageSize): void {
    this.tablePageSize.next({
      skip: 0,
      limit: pageSize,
      pageSize,
    });
  }

  /**
   * updateTableState function.
   * @param {pageSizeCal} payload - Current table pagination payload.
   * @returns {void} Result.
   */
  updateTableState(payload: pageSizeCal): void {
    this.calculatePageSize.next(payload);
  }
}

/**
 * provideLocalPagination function.
 * @returns {Provider} Result.
 */
export function provideLocalPagination(): Provider {
  return PaginationService;
}
export interface pageSelection {
  skip: number;
  limit: number;
}
export interface tablePageSize {
  skip: number;
  limit: number;
  pageSize: number;
}
export interface pageSizeCal {
  totalData: number;
  pageSize: number;
  tableData: any[];
  tableData2?: any[];
  tableDataCopy?: any[];
  serialNumberArray: number[];
}
export interface pageSize {
  pageSize: number;
}
