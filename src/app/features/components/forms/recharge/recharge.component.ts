import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recharge',
  imports: [ReactiveFormsModule],
  templateUrl: './recharge.component.html',
  styleUrl: './recharge.component.scss'
})
export class RechargeComponent {
  @Input() fromBalanceUser: any;
  @Input() selectedUser: any;
  deposit = 'deposit';
  withdraw = 'withdraw';

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
      amount: ['', Validators.required],
      googleOtp: ['', Validators.required],
      type: ['deposit', Validators.required],
    });
  }

  get controls() {
    return this.form.controls;
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() {
    if (this.selectedUser?.uuid) {
      this.form.patchValue({ selectedUser: this.selectedUser.uuid });
    }
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
    this.resetForm();
  }

  /**
   * resetForm function.
   * @returns {*} Result.
   */
  resetForm() {
    this.form.reset({
      selectedUser: this.selectedUser?.uuid || '',
      amount: '',
      googleOtp: '',
      type: this.deposit,
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
}

}