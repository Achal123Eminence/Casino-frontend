
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrl: './date-range-picker.component.scss',
     imports: [
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule
],
})
export class DateRangePickerComponent {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  /**
   * constructor function.
   * @returns {*} Result.
   */
  constructor() {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }
}
