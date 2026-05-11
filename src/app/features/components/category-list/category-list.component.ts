import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { DatahandlerService } from '../../../services/datahandler.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {

  private apiService = inject(DatahandlerService);

  providerId: any = '';

  providerDetails: any;

  categoryList: any[] = [];

  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.providerId = this.route.snapshot.paramMap.get('id');

    console.log('Provider Id:', this.providerId);

    this.getCategoryList();

  }

  getCategoryList() {

    this.isLoading = true;

    const payload = {};

    this.apiService
      .getCasinoCategory(payload, this.providerId)
      .subscribe({

        next: (res: any) => {

          console.log('Category List:', res);

          this.categoryList = res || [];

          // Optional provider details
          if (this.categoryList.length > 0) {

            this.providerDetails = {
              providerName:
                this.categoryList[0]?.providerId?.provider_name || 'Provider'
            };

          }

          this.isLoading = false;

        },

        error: (err: any) => {

          console.log(err);

          this.categoryList = [];

          this.isLoading = false;

          this.showToast(
            err?.error?.message || 'Failed to fetch categories',
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