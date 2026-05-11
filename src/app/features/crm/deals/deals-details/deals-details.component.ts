import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { routes } from '../../../../shared/routes/routes';

@Component({
  selector: 'app-deals-details',
  imports: [CommonModule,MatSelectModule,BsDatepickerModule,RouterLink],
  templateUrl: './deals-details.component.html',
  styleUrl: './deals-details.component.scss'
})
export class DealsDetailsComponent {
  routes=routes
selectedFieldSet=[0]
  trash:boolean=false;
/**
 * isTrash function.
 * @returns {*} Result.
 */
isTrash():void{
  this.trash=true;
}
  formData: any[][] = []; 

  /**
   * addNewRow function.
   * @param {*} i - Parameter.
   * @returns {*} Result.
   */
  addNewRow(i:number) {
     if (!this.formData[i]) {
    this.formData[i] = []; // Initialize as empty array if undefined
  }
  this.formData[i].push({});
  }

/**
 * removeRow function.
 * @param {*} rowIndex - Parameter.
 * @param {*} sectionIndex - Parameter.
 * @returns {*} Result.
 */
removeRow(rowIndex: number, sectionIndex: number) {
  const section = this.formData[sectionIndex];
  if (Array.isArray(section)) {
    section.splice(rowIndex, 1);
  }
}

  /**
   * trackByIndex function.
   * @param {*} index - Parameter.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  trackByIndex(index: number, item: any) {
    return index;
  }
}
