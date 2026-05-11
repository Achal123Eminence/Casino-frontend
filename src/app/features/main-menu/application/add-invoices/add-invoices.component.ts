import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { routes } from '../../../../shared/routes/routes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-invoices',
  imports: [MatSelectModule,BsDatepickerModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './add-invoices.component.html',
  styleUrl: './add-invoices.component.scss'
})
export class AddInvoicesComponent {
  routes=routes
  trash:boolean=false;
/**
 * isTrash function.
 * @returns {*} Result.
 */
isTrash():void{
  this.trash=true;
}
formData: any[] = []; 

  /**
   * addNewRow function.
   * @returns {*} Result.
   */
  addNewRow() {
    this.formData.push({});
  }

  /**
   * removeRow function.
   * @param {*} index - Parameter.
   * @returns {*} Result.
   */
  removeRow(index: number) {
      this.formData.splice(index, 1);
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
