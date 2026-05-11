import { Component } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leads-details',
  imports: [CommonModule,MatSelectModule,BsDatepickerModule,CollapseHeaderComponent,RouterLink],
  templateUrl: './leads-details.component.html',
  styleUrl: './leads-details.component.scss'
})
export class LeadsDetailsComponent {
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
