import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationDirective } from '../../../../shared/directives/validation.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-category-module',
  imports: [ValidationDirective, CommonModule, ReactiveFormsModule],
  templateUrl: './add-category-module.component.html',
  styleUrl: './add-category-module.component.scss',
})
export class AddCategoryModuleComponent {
  moduleForm: FormGroup;
  @Output() formSubmit = new EventEmitter<any>();
  @Input() categoryData: any;

  constructor(private fb: FormBuilder) {
    this.moduleForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryData'] && this.categoryData) {
      this.moduleForm.patchValue({
        name: this.categoryData.name
      });
    }
  }

  get controls() {
    return this.moduleForm.controls;
  }

  submit() {
    if (this.moduleForm.valid) {
      this.formSubmit.emit(this.moduleForm.value);
    }
    this.moduleForm.reset();
  }

  reset(){
    this.moduleForm.reset();
  }
}
