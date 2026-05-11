import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatahandlerService } from '../../../services/datahandler.service';

@Component({
  selector: 'app-casino-provider',
  imports: [CommonModule,
    FormsModule],
  templateUrl: './casino-provider.component.html',
  styleUrl: './casino-provider.component.scss',
})
export class CasinoProviderComponent {
  private apiService = inject(DatahandlerService);
  providerName: string = '';
  categoryName: string = '';
  providerNameError: boolean = false;
  categoryNameError: boolean = false;

  showCategoryModal: boolean = false;
  selectedCasinoType: string = 'awc';
  selectedProvider: any = null;

  providerList: any[] = [
    {
      id: 1,
      providerName: 'Evolution',
      gameName: '',
      gameCode: '',
      csvFile: null
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.getProviderList();

  }

  changeCasinoType(type: string) {

    if (this.selectedCasinoType === type) {
      return;
    }

    this.selectedCasinoType = type;

    this.getProviderList();

  }

  getProviderList() {

    const payload = {
      type: this.selectedCasinoType
    };

    this.apiService
      .getCasinoProvider(payload)
      .subscribe({

        next: (res: any) => {

          console.log('Provider List:', res);

          this.providerList = res || [];

        },

        error: (err: any) => {

          console.log(err);

          this.providerList = [];

          this.showToast(
            err?.error?.message || 'Failed to fetch providers',
            true
          );

        }

      });

  }

  validateProviderName() {

    const regex = /^[a-zA-Z0-9 ]*$/;

    this.providerNameError = !regex.test(this.providerName);

  }

  validateCategoryName() {

    const regex = /^[a-zA-Z0-9 ]*$/;

    this.categoryNameError = !regex.test(this.categoryName);

  }

  viewCategoryList(item: any) {

    this.router.navigate([
      '/casino-category-list',
      item._id
    ]);

  }

  addProvider() {

    this.validateProviderName();

    if (!this.providerName.trim()) {

      this.showToast(
        'Provider name is required',
        true
      );

      return;

    }

    if (this.providerNameError) {

      this.showToast(
        'Please enter valid provider name',
        true
      );

      return;

    }

    const payload = {
      provider_name: this.providerName.trim(),
      type: this.selectedCasinoType
    };

    Swal.fire({
      title: 'Add Provider?',
      text: `Do you want to add "${this.providerName}" provider?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {

      if (result.isConfirmed) {
        console.log(payload, "payload add provider")

        this.apiService
          .casinoAddProvider(payload)
          .subscribe({

            next: (res: any) => {

              this.showToast(
                res?.message || 'Provider added successfully'
              );

              this.providerName = '';
              this.providerNameError = false;

              this.getProviderList();

            },

            error: (err: any) => {

              this.showToast(
                err?.error?.message || 'Failed to add provider',
                true
              );

            }

          });

      }

    });

  }

  validateGameName(item: any) {

    const regex = /^[a-zA-Z0-9 ]*$/;

    item.gameNameError = !regex.test(item.gameName || '');

  }

  validateGameCode(item: any) {

    const regex = /^[a-zA-Z0-9 ]*$/;

    item.gameCodeError = !regex.test(item.gameCode || '');

  }

  addGameDetails(item: any) {

    this.validateGameName(item);
    this.validateGameCode(item);

    if (!item.gameName?.trim()) {

      this.showToast(
        'Game name is required',
        true
      );

      return;

    }

    if (!item.gameCode?.trim()) {

      this.showToast(
        'Game code is required',
        true
      );

      return;

    }

    if (item.gameNameError || item.gameCodeError) {

      this.showToast(
        'Please enter valid game details',
        true
      );

      return;

    }

    const payload = {
      provider_name: item.provider_name,
      game_name: item.gameName.trim(),
      game_code: item.gameCode.trim()
    };

    Swal.fire({
      title: 'Add Game?',
      text: `Do you want to add this game?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {

      if (result.isConfirmed) {

        console.log(payload, 'game payload');

        this.apiService
          .casinoAddGameDetails(payload)
          .subscribe({

            next: (res: any) => {

              this.showToast(
                res?.message || 'Game added successfully'
              );

              item.gameName = '';
              item.gameCode = '';

              item.gameNameError = false;
              item.gameCodeError = false;

            },

            error: (err: any) => {

              console.log(err);

              this.showToast(
                err?.error?.message || 'Failed to add game',
                true
              );

            }

          });

      }

    });

  }


  openCategoryModal(item: any) {

    this.selectedProvider = item;

    this.categoryName = '';

    this.categoryNameError = false;

    this.showCategoryModal = true;

  }

  closeCategoryModal() {

    this.showCategoryModal = false;

    this.categoryName = '';

    this.categoryNameError = false;

  }

  submitCategory() {

    this.validateCategoryName();

    if (!this.categoryName.trim()) {

      this.showToast(
        'Category name is required',
        true
      );

      return;

    }

    if (this.categoryNameError) {

      this.showToast(
        'Please enter valid category name',
        true
      );

      return;

    }

    const payload = {
      name: this.categoryName.trim(),
      providerId: this.selectedProvider?._id
    };

    Swal.fire({
      title: 'Add Category?',
      text: `Do you want to add "${this.categoryName}" category?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {

      if (result.isConfirmed) {

        console.log(payload, "payload of category")

        this.apiService
          .casinoAddCategory(payload)
          .subscribe({

            next: (res: any) => {

              console.log(res);

              this.showToast(
                res?.message || 'Category added successfully'
              );

              this.closeCategoryModal();

            },

            error: (err: any) => {

              console.log(err);

              this.showToast(
                err?.error?.message || 'Failed to add category',
                true
              );

            }

          });

      }

    });

  }


  onFileSelected(event: any, item: any) {
    const file = event.target.files[0];

    if (file) {
      item.csvFile = file;
      console.log('Selected File:', file);
    }

  }

  uploadCsv(item: any) {

    if (!item.csvFile) {
      return;
    }

    console.log('Uploading CSV:', item.csvFile);

  }

  private showToast(message: string, isError: boolean = false): void {
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
