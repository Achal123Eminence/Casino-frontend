import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../shared/common/confirm-modal/confirm-modal.component';
import { DatahandlerService } from '../../services/datahandler.service';
import { routes } from '../../shared/routes/routes';
import { AuthService } from '../../services/auth.service';

declare const bootstrap: any;

interface CountryRef {
  uuid: string;
  countryName: string;
  countryCode: string;
  shortName: string;
}

interface CurrencyItem {
  uuid: string;
  shortName: string;
  name: string;
  currencyId: string;
  symbol: string;
  conversionRate: number;
  isBase: boolean;
  status: number;
  country: CountryRef;
}

interface CountryOption {
  uuid: string;
  countryName: string;
  countryCode: string;
}

@Component({
  selector: 'app-currency',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ConfirmModalComponent],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
})
export class CurrencyComponent {
  public routes = routes;
  public tableData: CurrencyItem[] = [];
  public countries: CountryOption[] = [];
  public search = '';
  public isSubmitting = false;
  public isEditMode = false;
  public selectedUuid = '';
  public pendingStatusUuid: string | null = null;
  public pendingStatus: number | null = null;
  public modalTitle = 'Confirm';
  public modalMessage = 'Are you sure?';

  currencyForm;

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @param {*} dataService - Parameter.
   * @param {*} toastr - Parameter.
   * @returns {*} Result.
   */
  constructor(
    private fb: FormBuilder,
    private dataService: DatahandlerService,
    private toastr: ToastrService,
    public auth: AuthService
  ) {
    this.currencyForm = this.fb.group({
      shortName: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(60)]],
      symbol: ['', [Validators.maxLength(10)]],
      conversionRate: [1, [Validators.required, Validators.min(0.000001)]],
      isBase: [false],
      countryUuid: ['', [Validators.required]],
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.loadCountries();
    this.loadCurrencies();
  }

  /**
   * filteredCurrencies function.
   * @returns {*} Result.
   */
  get filteredCurrencies(): CurrencyItem[] {
    const keyword = this.search.trim().toLowerCase();
    if (!keyword) {
      return this.tableData;
    }
    return this.tableData.filter((item) =>
      [
        item.shortName,
        item.name,
        item.currencyId,
        item.symbol,
        item.country?.countryName,
        item.country?.countryCode,
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }

  /**
   * loadCountries function.
   * @returns {*} Result.
   */
  loadCountries(): void {
    this.dataService.getCountries({}).subscribe({
      next: (res: any) => {
        this.countries = (res?.data || []).map((item: any) => ({
          uuid: item.uuid,
          countryName: item.countryName,
          countryCode: item.countryCode,
        }));
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch countries', 'Error');
      },
    });
  }

  /**
   * loadCurrencies function.
   * @returns {*} Result.
   */
  loadCurrencies(): void {
    this.dataService.getCurrencies().subscribe({
      next: (res: any) => {
        this.tableData = res?.data || [];
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch currencies', 'Error');
      },
    });
  }

  /**
   * openAddModal function.
   * @returns {*} Result.
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedUuid = '';
    this.currencyForm.reset({
      shortName: '',
      name: '',
      symbol: '',
      conversionRate: 1,
      isBase: false,
      countryUuid: '',
    });
  }

  /**
   * openEditModal function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  openEditModal(item: CurrencyItem): void {
    this.isEditMode = true;
    this.selectedUuid = item.uuid;
    this.currencyForm.patchValue({
      shortName: item.shortName,
      name: item.name,
      symbol: item.symbol || '',
      conversionRate: item.conversionRate,
      isBase: !!item.isBase,
      countryUuid: item.country?.uuid || '',
    });
  }

  /**
   * submitCurrency function.
   * @returns {*} Result.
   */
  submitCurrency(): void {
    if (this.currencyForm.invalid || this.isSubmitting) {
      this.currencyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = {
      shortName: String(this.currencyForm.value.shortName || '').trim().toUpperCase(),
      name: String(this.currencyForm.value.name || '').trim(),
      symbol: String(this.currencyForm.value.symbol || '').trim(),
      conversionRate: Number(this.currencyForm.value.conversionRate),
      isBase: Boolean(this.currencyForm.value.isBase),
      countryUuid: String(this.currencyForm.value.countryUuid || '').trim(),
    };

    const request$ = this.isEditMode
      ? this.dataService.updateCurrency(this.selectedUuid, payload)
      : this.dataService.createCurrency(payload);

    request$.subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Success', 'Success');
        this.closeModal();
        this.loadCurrencies();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to save currency', 'Error');
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  /**
   * onStatusToggle function.
   * @param {*} event - Parameter.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  onStatusToggle(event: Event, item: CurrencyItem): void {
    event.preventDefault();
    this.pendingStatusUuid = item.uuid;
    this.pendingStatus = item.status === 1 ? 0 : 1;
    this.modalTitle = this.pendingStatus === 1 ? 'Activate Currency' : 'Deactivate Currency';
    this.modalMessage =
      this.pendingStatus === 0
        ? 'If you want to deactivate this currency?'
        : `Do you want to activate ${item.shortName}?`;

    const modalElement = document.getElementById('changeCurrencyStatus');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * confirmStatusChange function.
   * @returns {*} Result.
   */
  confirmStatusChange(): void {
    if (!this.pendingStatusUuid || this.pendingStatus === null) {
      return;
    }

    const uuid = this.pendingStatusUuid;
    const status = this.pendingStatus;
    this.pendingStatusUuid = null;
    this.pendingStatus = null;

    this.dataService.updateCurrencyStatus({ uuid, status }).subscribe({
      next: (res: any) => {
        const index = this.tableData.findIndex((item) => item.uuid === uuid);
        if (index !== -1) {
          this.tableData[index].status = status;
        }
        this.toastr.success(res?.message || 'Currency status updated successfully', 'Success');
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update currency status', 'Error');
      },
    });
  }

  /**
   * closeModal function.
   * @returns {*} Result.
   */
  closeModal(): void {
    const modalEl = document.getElementById('currencyModal');
    if (!modalEl) {
      return;
    }
    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
    instance.hide();
    this.removeStaleModalBackdrop();
  }

  /**
   * removeStaleModalBackdrop function.
   * @returns {*} Result.
   */
  private removeStaleModalBackdrop(): void {
    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }, 150);
  }
}
