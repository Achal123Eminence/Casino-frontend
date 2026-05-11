import { Component, EventEmitter, Input, Output } from '@angular/core';
import { exportToExcel, exportToPDF } from '../../helper/export-data';


@Component({
  selector: 'app-export-dropdown',
  imports: [],
  templateUrl: './export-dropdown.component.html',
  styleUrl: './export-dropdown.component.scss'
})
export class ExportDropdownComponent {
  
  @Input() exportData: any[] = [];
  @Input() fileName: string = 'Export';

  // 🔥 Tell parent: "Please fetch data and export as PDF/XLS"
  @Output() exportRequest = new EventEmitter<'pdf' | 'xls'>();

  // Store the type user clicked
  requestedType: 'pdf' | 'xls' | null = null;

  /**
   * requestExport function.
   * @param {*} type - Parameter.
   * @returns {*} Result.
   */
  requestExport(type: 'pdf' | 'xls') {
    this.requestedType = type;
    this.exportRequest.emit(type); // 👉 This will call parent’s getTableData()
  }

  /**
   * ngOnChanges function.
   * @returns {*} Result.
   */
  ngOnChanges() {
    // 👉 Once parent updates exportData, trigger download automatically
    if (this.exportData && this.exportData.length > 0 && this.requestedType) {
      if (this.requestedType === 'xls') {
        exportToExcel(this.exportData, this.fileName);
      } else if (this.requestedType === 'pdf') {
        exportToPDF(this.exportData, this.fileName);
      }
      this.requestedType = null; // reset
    }
  }
}