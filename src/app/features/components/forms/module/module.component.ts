import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { modules } from '../../../../shared/model/pages.model';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-module',
  imports: [ReactiveFormsModule, NgMultiSelectDropDownModule],
  templateUrl: './module.component.html',
  styleUrl: './module.component.scss'
})
export class ModuleComponent {
  moduleForm: FormGroup;
  @Input() parentModules: modules[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  categoryDropdownSettings: any = {
    singleSelection: false,
    idField: 'uuid',
    textField: 'name',
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  @Input() categories: any[] = [];
  @Input() moduleData: any;

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @returns {*} Result.
   */
  constructor(private fb: FormBuilder) {
    this.moduleForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'), // only letters and spaces
        ],
      ],
      shortName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Z]+$'), // only uppercase letters
        ],
      ],
      parentId: [
        null,
      ],
      category: [[], Validators.required],
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['moduleData'] && this.moduleData) {
      this.moduleForm.patchValue({
        name: this.moduleData.name,
        shortName: this.moduleData.shortName,
        parentId: this.moduleData.parentId,
        category: this.moduleData.categoryNames || []
      });
      this.moduleForm.get('shortName')?.disable();
    } else {
      this.moduleForm.get('shortName')?.enable();
    }
  }

  get controls() {
    return this.moduleForm.controls;
  }

  /**
   * submit function.
   * @returns {*} Result.
   */
  submit() {
    if (this.moduleForm.valid) {
      this.formSubmit.emit(this.moduleForm.value);
    }
  }

  reset() {
  this.moduleForm.reset({
    name: '',
    shortName: '',
    parentId: null,
    category: []
  });

  this.moduleForm.markAsPristine();
  this.moduleForm.markAsUntouched();
}

}

