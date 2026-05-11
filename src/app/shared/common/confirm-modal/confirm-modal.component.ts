import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Input() modalId: string = 'globalConfirmModal';

  @Output() confirmed = new EventEmitter<void>();

  /**
   * onConfirm function.
   * @returns {*} Result.
   */
  onConfirm() {
    this.confirmed.emit();
  }
}
