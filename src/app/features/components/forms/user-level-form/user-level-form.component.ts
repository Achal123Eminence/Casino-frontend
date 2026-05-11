import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-level-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-level-form.component.html',
  styleUrl: './user-level-form.component.scss',
})
export class UserLevelFormComponent implements OnChanges {
  fieldForm: FormGroup;
  @Input() levelData: any = null;   // 👈 now we accept edit data
  button : string = "Save Level"

  @Output() submitForm = new EventEmitter<any>();

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @returns {*} Result.
   */
  constructor(private fb: FormBuilder) {
    this.fieldForm = this.fb.group({
      title: [
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
      level: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
        ],
      ],
      canUserBeCreated: [false, [Validators.required]],
    });
  }

  get controls() {
    return this.fieldForm.controls;
  }

  /**
   * onSubmit function.
   * @returns {*} Result.
   */
  onSubmit() {
    if (this.fieldForm.valid) {
      this.submitForm.emit(this.fieldForm.value);
    }
  }

  /**
   * ngOnChanges function.
   * @param {*} changes - Parameter.
   * @returns {*} Result.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['levelData']) {
      if (this.levelData) {
        this.button = "Update Level"
        this.fieldForm.patchValue({
          title: this.levelData.title || '',
          shortName: this.levelData.shortName || '',
          level: this.levelData.level || null,
          canUserBeCreated: this.levelData.canUserBeCreated ?? true,
        });
      } else {
        this.fieldForm.reset({
          canUserBeCreated: false,
        });
      }
    }
  }
}
