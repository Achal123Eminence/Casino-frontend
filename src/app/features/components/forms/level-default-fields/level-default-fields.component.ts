import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-level-default-fields',
  imports: [ReactiveFormsModule],
  templateUrl: './level-default-fields.component.html',
  styleUrls: ['./level-default-fields.component.scss']
})
export class LevelDefaultFieldsComponent implements OnChanges {
  @Input() defaultFields: any[] = [];
  @Input() selectedLevelFormFields: any[] = [];
  @Input() selectedLevel: any = {};
  @Output() formSubmit = new EventEmitter<any>();

  fieldForm: FormGroup;

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @returns {*} Result.
   */
  constructor(private fb: FormBuilder) {
    this.fieldForm = this.fb.group({
      userLevelUuid: ['', Validators.required],
      fields: this.fb.array([]) // Just initialize a blank FormArray
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(){
    this.fieldForm.controls['userLevelUuid'].patchValue(this.selectedLevel.uuid)
  }

  /**
   * ngOnChanges function.
   * @param {*} changes - Parameter.
   * @returns {*} Result.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['defaultFields'] && this.defaultFields?.length) ||
      (changes['selectedLevelFormFields'] && this.selectedLevelFormFields)
    ) {
      this.buildOrPatchForm();
    }
  }

  get fields(): FormArray<FormGroup> {
    return this.fieldForm.get('fields') as FormArray<FormGroup>;
  }


  /**
   * buildOrPatchForm function.
   * @returns {*} Result.
   */
  private buildOrPatchForm(): void {
    const selectedMap = new Map(
      (this.selectedLevelFormFields || []).map(item => [
        item.formFieldId.uuid,
        {
          isEnabled: item.isEnabled,
          isRequired: item.isRequired,
          order: item.order
        }
      ])
    );

    const formArray = this.fb.array(
      this.defaultFields.map((field, index) => {
        const selected = selectedMap.get(field.uuid);
        return this.fb.group({
          formFieldUuid: [field.uuid],
          label: [field.label],
          isEnabled: [selected?.isEnabled ?? false],
          isRequired: [selected?.isRequired ?? false],
          order: [selected?.order ?? index + 1]
        });
      })
    );

    this.fieldForm.setControl('fields', formArray);
  }

  /**
   * logFormValue function.
   * @returns {*} Result.
   */
  logFormValue(): void {
  }

  /**
   * submit function.
   * @returns {*} Result.
   */
  submit() {
    this.fieldForm.controls['userLevelUuid'].patchValue(this.selectedLevel.uuid)
    if (this.fieldForm.valid) {
      this.formSubmit.emit(this.fieldForm.value);
    }
  }
}
