import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-user',
  imports: [ReactiveFormsModule],
  templateUrl: './role-user.component.html',
  styleUrl: './role-user.component.scss'
})
export class RoleUserComponent {
  userForm!: FormGroup;
  @Input() userData: any;
  @Output() formSubmit = new EventEmitter<any>();

  // Dynamic field config (can come from API)
  formFieldList = [
    { formFieldId: { name: 'userId', label: 'User ID', placeholder: 'Enter User ID', inputType: 'textbox', required: true } },
    { formFieldId: { name: 'userName', label: 'User Name', placeholder: 'Enter User Name', inputType: 'textbox', required: true } },
    { formFieldId: { name: 'email', label: 'Email', placeholder: 'Enter Email', inputType: 'email', required: true } },
    { formFieldId: { name: 'password', label: 'Password', placeholder: 'Enter Password', inputType: 'password', required: true } },
    { formFieldId: { name: 'mobile', label: 'Mobile', placeholder: 'Enter Mobile Number', inputType: 'textbox', required: false } }
  ];

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @returns {*} Result.
   */
  constructor(private fb: FormBuilder) {}

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    const formGroupConfig: any = {};
    this.formFieldList.forEach(field => {
      formGroupConfig[field.formFieldId.name] = field.formFieldId.required
        ? ['', Validators.required]
        : [''];
    });

    this.userForm = this.fb.group(formGroupConfig);
  }

  /**
   * ngOnChanges function.
   * @param {*} changes - Parameter.
   * @returns {*} Result.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      if (this.userForm) {
        this.userForm.patchValue(this.userData);

        if (this.userData) {
          const isEdit = !!this.userData;

          // Disable password field on edit
          if (isEdit) {
            this.userForm.get('password')?.disable();
          } else {
            this.userForm.get('password')?.enable();
          }

          // Optionally disable userId on edit
          this.userForm.get('userId')?.disable();
        }
      }
    }
  }

  /**
   * submit function.
   * @returns {*} Result.
   */
  submit() {
    if (this.userForm.valid) {
      const payload: any = this.userForm.value;

      // pass uuid when editing
      const isEdit = !!this.userData;
      if (isEdit) { payload.uuid = this.userData.uuid }
      this.formSubmit.emit(payload)
    }
    else {
      this.userForm.markAllAsTouched();
    }
  }
}
