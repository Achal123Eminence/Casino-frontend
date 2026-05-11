import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent,CalendarView } from 'angular-calendar';
import { CalendarWrapperModule } from '../../../shared/calendar-wrapper.module'; // adjust path if needed
import {  startOfDay,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths, } from 'date-fns';

@Component({
  selector: 'app-custom-calendar',
  standalone: true,
  imports: [CommonModule, CalendarWrapperModule],
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
})
export class CustomCalendarComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: 'Meeting with Team',
      color: { primary: '#1e90ff', secondary: '#D1E8FF' },
    },
  ];
  /**
   * prevMonth function.
   * @returns {*} Result.
   */
  prevMonth() {
  this.viewDate = subMonths(this.viewDate, 1);
}

/**
 * nextMonth function.
 * @returns {*} Result.
 */
nextMonth() {
  this.viewDate = addMonths(this.viewDate, 1);
}


 /**
  * setView function.
  * @param {*} view - Parameter.
  * @returns {*} Result.
  */
 setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * today function.
   * @returns {*} Result.
   */
  today(): void {
    this.viewDate = new Date();
  }

  /**
   * next function.
   * @returns {*} Result.
   */
  next(): void {
    this.viewDate = this.changeDateByView(this.viewDate, 1);
  }

  /**
   * prev function.
   * @returns {*} Result.
   */
  prev(): void {
    this.viewDate = this.changeDateByView(this.viewDate, -1);
  }

  /**
   * changeDateByView function.
   * @param {*} date - Parameter.
   * @param {*} step - Parameter.
   * @returns {*} Result.
   */
  private changeDateByView(date: Date, step: number): Date {
    switch (this.view) {
      case CalendarView.Month:
        return step > 0 ? addMonths(date, 1) : subMonths(date, 1);
      case CalendarView.Week:
        return step > 0 ? addWeeks(date, 1) : subWeeks(date, 1);
      case CalendarView.Day:
        return step > 0 ? addDays(date, 1) : subDays(date, 1);
      default:
        return date;
    }
  }
}
