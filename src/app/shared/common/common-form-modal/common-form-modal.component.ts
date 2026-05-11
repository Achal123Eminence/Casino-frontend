import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-form-modal',
  templateUrl: './common-form-modal.component.html'
})
export class CommonFormModalComponent {
  @Input() modalId: string = 'commonFormModal';
  @Input() title: string = 'Form Modal';

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  /**
   * onSave function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  onSave(event: Event) {
    event.preventDefault(); // ✅ Prevent page reload
    this.save.emit();
  }

  /**
   * onCancel function.
   * @returns {*} Result.
   */
  onCancel() {
    this.cancel.emit();
  }
}
