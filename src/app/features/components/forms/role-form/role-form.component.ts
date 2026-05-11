import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';

import { modules } from '../../../../shared/model/pages.model';
@Component({
  selector: 'app-role-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss'
})
export class RoleFormComponent implements OnChanges {
  roleForm!: FormGroup;
  @Output() formSubmit = new EventEmitter<any>();
  @Input() roleData: any = null;

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @returns {*} Result.
   */
  constructor(private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      shortName: ['', [Validators.required, Validators.pattern('^[A-Z_]+$')]],
      description: [''],
      isAvailableForDownline: [false, [Validators.required]],
    });
  }
  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() { }


  get controls() {
    return this.roleForm.controls;
  }

  /**
   * submit function.
   * @returns {*} Result.
   */
  submit() {
    if (this.roleForm.valid) {
      this.formSubmit.emit(this.roleForm.value);
    }
  }

  /**
   * ngOnChanges function.
   * @param {*} changes - Parameter.
   * @returns {*} Result.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['roleData'] && this.roleData && this.roleForm) {
      this.roleForm.patchValue({
        name: this.roleData.name || '',
        shortName: this.roleData.shortName || '',
        description: this.roleData.description || '',
        isAvailableForDownline: this.roleData.isAvailableForDownline ?? false
      });
    } else {
      this.roleForm.reset({
        isAvailableForDownline: false
      });
    }
  }

}

