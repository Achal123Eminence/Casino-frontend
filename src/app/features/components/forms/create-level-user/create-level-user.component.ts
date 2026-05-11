import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DatahandlerService } from '../../../../services/datahandler.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { levelUserFormField } from '../../../../shared/model/pages.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-level-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-level-user.component.html',
  styleUrl: './create-level-user.component.scss',
})
export class CreateLevelUserComponent {
  @Input() nextLevel: any;
  @Input() selectedUser: any = null;
  @Output() formSubmit = new EventEmitter<any>();

  public formFieldList: levelUserFormField[] = [];
  public dynamicForm: FormGroup = new FormGroup({});
  button: string = 'Save User';

  /**
   * constructor function.
   * @param {*} dataserve - Parameter.
   * @returns {*} Result.
   */
  constructor(private dataserve: DatahandlerService) {}

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() {
    // this.getFormByLevel(this.nextLevel.uuid)
  }

  /**
   * getFormByLevel function.
   * @param {*} uuid - Parameter.
   * @returns {*} Result.
   */
  getFormByLevel(uuid: string) {
    this.dataserve.getFormByLevel(uuid).subscribe((res: any) => {
      this.formFieldList = res?.data?.sort(
        (a: any, b: any) => a.order - b.order
      );
      this.buildForm();
      if (this.selectedUser) {
        this.patchFormValues();
      }
    });
  }

  /**
   * buildForm function.
   * @returns {*} Result.
   */
  buildForm() {
    const group: { [key: string]: FormControl } = {};
    const isEditMode = !!this.selectedUser;

    this.formFieldList
      .filter((field) => field.isEnabled)
      .sort((a, b) => a.order - b.order)
      .forEach((field) => {
        const validators = [];
        const fieldId = field.formFieldId;

        // Password is required for new users, optional for edit
        if (
          (field.isRequired || fieldId.required) &&
          !(isEditMode && fieldId.inputType === 'password')
        ) {
          validators.push(Validators.required);
        }

        if (fieldId.minLength)
          validators.push(Validators.minLength(fieldId.minLength));
        if (fieldId.maxLength)
          validators.push(Validators.maxLength(fieldId.maxLength));
        if (fieldId.regex) validators.push(Validators.pattern(fieldId.regex));

        if (this.selectedUser && this.dynamicForm.get('password')) {
          const passwordCtrl = this.dynamicForm.get('password');
          passwordCtrl?.clearValidators();
          passwordCtrl?.updateValueAndValidity();
        }

        group[fieldId.name] = new FormControl('', validators);
      });

    this.dynamicForm = new FormGroup(group);
    // Patch values if edit mode
    if (isEditMode) this.patchFormValues();

  }

  /**
   * getErrorMessage function.
   * @param {*} field - Parameter.
   * @returns {*} Result.
   */
  getErrorMessage(field: any): string {
    const control = this.dynamicForm.get(field.formFieldId.name);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const msgs = field.formFieldId.errorMessages;

    if (errors['required']) return msgs.required;
    if (errors['minlength']) return msgs.minLength;
    if (errors['maxlength']) return msgs.maxLength;
    if (errors['pattern']) return msgs.regex;

    return 'Invalid field';
  }

  /**
   * patchFormValues function.
   * @returns {*} Result.
   */
  patchFormValues() {
    if (!this.selectedUser) return;
    const patchData: any = {};
    this.formFieldList.forEach((field) => {
      const fieldName = field.formFieldId.name;
      if (this.selectedUser[fieldName] !== undefined) {
        patchData[fieldName] = this.selectedUser[fieldName];
      }
    });
    // if (patchData.email) {
    //   const control = this.dynamicForm.get('email');
    //   if (control) {
    //     control.disable();
    //   }
    // } else {
    //   const control = this.dynamicForm.get('email');
    //   if (control) {
    //     control.enable();
    //   }
    // }

     if (patchData.userId) {
      const control = this.dynamicForm.get('userId');
      if (control) {
        control.disable();
      }
    } else {
      const control = this.dynamicForm.get('userId');
      if (control) {
        control.enable();
      }
    }

    this.dynamicForm.patchValue(patchData);
  }

  /**
   * disableEditFields function.
   * @returns {*} Result.
   */
  disableEditFields() {
    const disableFields = ['userId', 'email'];

    disableFields.forEach((fieldName) => {
      const control = this.dynamicForm.get(fieldName);
      if (control) {
        control.disable();
      }
    });
  }

  /**
   * submit function.
   * @returns {*} Result.
   */
  submit() {
    if (this.dynamicForm.valid) {
      const formDataWithUuid: any = {};

      this.formFieldList.forEach((field) => {
        if (field.isEnabled) {
          const fieldName = field.formFieldId.name;
          const value = this.dynamicForm.get(fieldName)?.value;

          // Only send password if it's non-empty
          if (fieldName === 'password' && (!value || value === '')) return;

          formDataWithUuid[field.formFieldId.uuid] = value;
        }
      });

      this.formSubmit.emit(formDataWithUuid);
    } else {
    }
  }

  /**
   * ngOnChanges function.
   * @param {*} changes - Parameter.
   * @returns {*} Result.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['nextLevel'] && this.nextLevel) {
      this.getFormByLevel(this.nextLevel.uuid);
    }
    if (changes['selectedUser'] && !changes['selectedUser'].firstChange) {
      this.button = ' Update User';

      if (this.dynamicForm && this.formFieldList.length) {
        this.patchFormValues();
      }
    }
  }
}
