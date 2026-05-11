import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { DatahandlerService } from '../../../services/datahandler.service';


@Component({
  selector: 'app-images',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
})
export class ImagesComponent implements OnInit {

  providers: any[] = [];
  categories: any[] = [];

  isLoading = false;

  imageForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: DatahandlerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getProviders();
  }

  initializeForm() {
    this.imageForm = this.fb.group({
      provider: ['', Validators.required],
      category: ['', Validators.required],

      images: this.fb.array([
        this.createImageRow()
      ])
    });
  }

  createImageRow(): FormGroup {
    return this.fb.group({
      image_name: [''],
      game_code: [''],
      image: [null],
      image_url: ['']
    });
  }

  get imagesArray(): FormArray {
    return this.imageForm.get('images') as FormArray;
  }

  addRow() {
    this.imagesArray.push(this.createImageRow());
  }

  removeRow(index: number) {
    if (this.imagesArray.length > 1) {
      this.imagesArray.removeAt(index);
    }
  }

  // =========================
  // GET PROVIDERS
  // =========================

  getProviders() {
    this.apiService.getCasinoProvider({type:'awc'}).subscribe({
      next: (res: any) => {
        console.log('Providers:', res);
        this.providers = res || [];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // =========================
  // GET CATEGORIES
  // =========================

  onProviderChange(event: any) {

    const providerId = event.target.value;

    this.imageForm.patchValue({
      category: ''
    });

    this.categories = [];

    if (!providerId) return;

    this.apiService.getCasinoCategory({}, providerId).subscribe({
      next: (res: any) => {
        console.log('Categories:', res);
        this.categories = res || [];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // =========================
  // FILE SELECT
  // =========================

  onFileSelect(event: any, index: number) {

    const file = event.target.files[0];

    if (file) {
      this.imagesArray.at(index).patchValue({
        image: file
      });
    }
  }

  // =========================
  // SUBMIT
  // =========================

  submitImages() {

    if (this.imageForm.invalid) {
      this.imageForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const providerId = this.imageForm.value.provider;
    const categoryId = this.imageForm.value.category;

    const imageRequests = this.imagesArray.controls.map((control: any) => {

      const formData = new FormData();

      formData.append('name', control.value.image_name);
      formData.append('image_url', control.value.image_url);
      formData.append('file', control.value.image);
      formData.append('category_id', categoryId);
      formData.append('provider_id', providerId);

      return this.apiService.casinoAddImages(formData);
    });

    Promise.all(
      imageRequests.map((obs: any) => obs.toPromise())
    )
      .then((res) => {

        this.isLoading = false;

        alert('Images Uploaded Successfully');

        this.initializeForm();
      })
      .catch((err) => {

        this.isLoading = false;

        console.log(err);

        alert('Something went wrong');
      });
  }

}