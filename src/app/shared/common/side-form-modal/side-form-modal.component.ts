import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-form-modal',
  imports: [],
  templateUrl: './side-form-modal.component.html',
  styleUrl: './side-form-modal.component.scss'
})
export class SideFormModalComponent {
  @Input() formId: string = 'offcanvas_add';
  @Input() title: string = 'Create New Field Definition';
  fieldForm: any;
}
