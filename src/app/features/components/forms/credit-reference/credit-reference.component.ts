import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-credit-reference',
  imports: [ReactiveFormsModule],
  templateUrl: './credit-reference.component.html',
  styleUrl: './credit-reference.component.scss'
})
export class CreditReferenceComponent {
  @Input() selectedUser: any;
  @Output() formSubmit = new EventEmitter<any>();

  form: FormGroup;

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @returns {*} Result.
   */
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedUser: ['', Validators.required],
      creditReference: ['', Validators.required],
      googleOtp: ['', Validators.required]
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit = () => {
    this.form.controls['selectedUser'].patchValue(this.selectedUser.uuid)
  }

  /**
   * submit function.
   * @returns {*} Result.
   */
  submit() {
    this.form.controls['selectedUser'].patchValue(this.selectedUser.uuid)
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
