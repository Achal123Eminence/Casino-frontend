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
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';


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
  activeTab = 'addImages';
  imagesList: any[] = [];

  isLoading = false;

  imageForm!: FormGroup;
  editForm!: FormGroup;

  editCategories: any[] = [];

  selectedEditImage: any = null;

  editingImageId: string = '';
  baseUrl = environment.baseUrl;

  constructor(
    private fb: FormBuilder,
    private apiService: DatahandlerService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getProviders();
    this.initializeEditForm();
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

  initializeEditForm() {

    this.editForm = this.fb.group({
      provider: ['', Validators.required],
      category: ['', Validators.required],
      image_name: ['', Validators.required],
      game_code: [''],
      image_url: [''],
      image: [null]
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

  getImagesList() {

    this.apiService.getCasinoImages().subscribe({
      next: (res: any) => {

        console.log(res, "Images List:")

        this.imagesList = res?.data || [];

      },
      error: (err: any) => {

        console.log(err);

      }
    });

  }

  // =========================
  // GET PROVIDERS
  // =========================

  getProviders() {
    this.apiService.getCasinoProvider({ type: 'awc' }).subscribe({
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
      formData.append('game_code', control.value.game_code);

      return this.apiService.casinoAddImages(formData);
    });

    Promise.all(
      imageRequests.map((obs: any) => obs.toPromise())
    )
      .then((res) => {

        this.isLoading = false;

        // alert('Images Uploaded Successfully');
        this.showToast('Images uploaded successfully')

        this.initializeForm();
      })
      .catch((err) => {

        this.isLoading = false;

        console.log(err);

        this.showToast('Something went wrong', true);
      });
  }

  updateFeaturedStatus(event: any, item: any) {

    // original value before change
    const previousStatus = item.image_fav_game;

    // new toggled value
    const newStatus = event.target.checked;

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newStatus ? 'enable' : 'disable'} featured status?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update'
    }).then((result) => {

      // =========================
      // CONFIRMED
      // =========================

      if (result.isConfirmed) {

        const payload = {
          image_fav_game: newStatus
        };

        this.apiService
          .updateCasinoImagesStatus(payload, item._id)
          .subscribe({

            next: (res: any) => {

              // update local value
              item.image_fav_game = newStatus;

              this.showToast(
                'Featured status updated successfully'
              );

            },

            error: (err: any) => {

              console.log(err);

              // restore old value
              item.image_fav_game = previousStatus;

              // restore checkbox UI
              event.target.checked = previousStatus;

              this.showToast(
                'Failed to update featured status',
                true
              );

            }

          });

      }

      // =========================
      // CANCELLED
      // =========================

      else {

        // restore old value
        item.image_fav_game = previousStatus;

        // restore checkbox UI
        event.target.checked = previousStatus;

      }

    });

  }

  deleteImage(item: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete'
    }).then((result) => {

      // =========================
      // CONFIRMED
      // =========================

      if (result.isConfirmed) {

        this.apiService
          .deleteCasinoImages({}, item._id)
          .subscribe({

            next: (res: any) => {

              // refresh updated list
              this.getImagesList();

              this.showToast(
                'Image deleted successfully'
              );

            },

            error: (err: any) => {

              console.log(err);

              this.showToast(
                'Failed to delete image',
                true
              );

            }

          });

      }

    });

  }

  openEditModal(item: any) {

    this.editingImageId = item._id;

    this.selectedEditImage = null;

    // load categories of current provider
    this.apiService
      .getCasinoCategory({}, item.provider_id._id)
      .subscribe({

        next: (res: any) => {

          this.editCategories = res || [];

          this.editForm.patchValue({

            provider: item.provider_id._id,
            category: item.category_id._id,
            image_name: item.name,
            game_code: item.game_code,
            image_url: item.image_url

          });

        }

      });

    // bootstrap modal open
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('editImageModal')
    );

    modal.show();

  }


  onEditProviderChange(event: any) {

    const providerId = event.target.value;

    const currentCategory = this.editForm.value.category;

    this.apiService
      .getCasinoCategory({}, providerId)
      .subscribe({

        next: (res: any) => {

          this.editCategories = res || [];

          // check if current category exists
          const categoryExists = this.editCategories.some(
            (cat: any) => cat._id === currentCategory
          );

          // if category not part of new provider
          if (!categoryExists) {

            this.editForm.patchValue({
              category: ''
            });

          }

        }

      });

  }

  onEditFileSelect(event: any) {

    const file = event.target.files[0];

    if (file) {

      this.selectedEditImage = file;

      this.editForm.patchValue({
        image: file
      });

    }

  }

  updateImage() {

    if (this.editForm.invalid) {

      this.editForm.markAllAsTouched();

      return;

    }

    const payload = {

      provider_id: this.editForm.value.provider,

      category_id: this.editForm.value.category,

      name: this.editForm.value.image_name,

      game_code: this.editForm.value.game_code,

      image_url: this.editForm.value.image_url

    };

    this.apiService
      .updateCasinoGameDetails(
        payload,
        this.editingImageId
      )
      .subscribe({

        next: (res: any) => {

          this.showToast(
            'Image updated successfully'
          );

          this.getImagesList();

          const modal =
            (window as any).bootstrap.Modal.getInstance(
              document.getElementById('editImageModal')
            );

          modal.hide();

        },

        error: (err: any) => {

          console.log(err);

          this.showToast(
            err?.error?.message || 'Failed to update image',
            true
          );

        }

      });

  }


  private showToast(
    message: string,
    isError: boolean = false
  ): void {

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: isError ? 'error' : 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

  }

}