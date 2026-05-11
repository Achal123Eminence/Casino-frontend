import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../shared/common/confirm-modal/confirm-modal.component';
import { DatahandlerService } from '../../services/datahandler.service';
import { routes } from '../../shared/routes/routes';
import { AuthService } from '../../services/auth.service';

declare const bootstrap: any;

interface CountryItem {
  uuid: string;
  countryName: string;
  countryCode: string;
  numberCode: string;
  shortName: string;
  countryId: string;
  region: string;
  timezone: string;
  flagIcon: string;
  teamJersey: string;
  status: number;
}

interface AvailableCountry {
  countryName: string;
  countryCode: string;
  numberCode: string;
  shortName: string;
  region: string;
  timezone: string;
  flagIcon: string;
}

@Component({
  selector: 'app-country',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
})
export class CountryComponent implements OnInit, AfterViewInit, OnDestroy {
  public routes = routes;
  public tableData: CountryItem[] = [];
  public availableCountries: AvailableCountry[] = [];
  public search = '';
  public isSubmitting = false;
  public isEditMode = false;
  public selectedUuid = '';
  public pendingStatusUuid: string | null = null;
  public pendingStatus: number | null = null;
  public modalTitle = 'Confirm';
  public modalMessage = 'Are you sure?';
  public flagObjectUrl: string | null = null;
  public jerseyObjectUrl: string | null = null;
  public pendingFlagFile: File | null = null;
  public pendingJerseyFile: File | null = null;
  public flagUploading = false;
  public jerseyUploading = false;
  private countryModalEl: HTMLElement | null = null;
  private readonly onCountryModalHidden = () => {
    this.revokeImageObjectUrls();
    this.flagObjectUrl = null;
    this.jerseyObjectUrl = null;
    this.pendingFlagFile = null;
    this.pendingJerseyFile = null;
    this.flagUploading = false;
    this.jerseyUploading = false;
    this.isSubmitting = false;
    this.removeStaleModalBackdrop();
  };

  countryForm;

  /** Preview URL for flag: temporary object URL or saved URL. */
  get flagPreviewUrl(): string | null {
    if (this.flagObjectUrl) return this.flagObjectUrl;
    const v = this.countryForm?.get('flagIcon')?.value;
    return v ?? null;
  }

  /** Preview URL for jersey: temporary object URL or saved URL. */
  get jerseyPreviewUrl(): string | null {
    if (this.jerseyObjectUrl) return this.jerseyObjectUrl;
    const v = this.countryForm?.get('teamJersey')?.value;
    return v ?? null;
  }

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @param {*} dataService - Parameter.
   * @param {*} toastr - Parameter.
   * @returns {*} Result.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DatahandlerService,
    private readonly toastr: ToastrService,
    public auth: AuthService

  ) {
    this.countryForm = this.fb.group({
      countryCode: ['', [Validators.required]],
      flagIcon: [''],
      teamJersey: [''],
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.loadCountries();
  }

  ngAfterViewInit(): void {
    this.countryModalEl = document.getElementById('countryModal');
    this.countryModalEl?.addEventListener('hidden.bs.modal', this.onCountryModalHidden);
  }

  ngOnDestroy(): void {
    this.countryModalEl?.removeEventListener('hidden.bs.modal', this.onCountryModalHidden);
    this.revokeImageObjectUrls();
  }

  /**
   * filteredCountries function.
   * @returns {*} Result.
   */
  get filteredCountries(): CountryItem[] {
    const keyword = this.search.trim().toLowerCase();
    if (!keyword) {
      return this.tableData;
    }
    return this.tableData.filter((item) =>
      [item.countryName, item.countryCode, item.countryId, item.shortName]
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
    this.dataService.getCountries().subscribe({
      next: (res: any) => {
        this.tableData = res?.data || [];
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch countries', 'Error');
      },
    });
  }

  /**
   * loadAvailableCountries function.
   * @returns {*} Result.
   */
  loadAvailableCountries(): void {
    this.dataService.getAvailableCountries().subscribe({
      next: (res: any) => {
        this.availableCountries = res?.data || [];
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch available countries', 'Error');
      },
    });
  }

  private showCountryModal(): void {
    const modalEl = document.getElementById('countryModal');
    if (!modalEl) return;
    // Clear any stale state before showing.
    this.removeStaleModalBackdrop();
    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
    instance.show();
  }

  /**
   * openAddModal function.
   * @returns {*} Result.
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedUuid = '';
    this.revokeImageObjectUrls();
    this.flagObjectUrl = null;
    this.jerseyObjectUrl = null;
    this.pendingFlagFile = null;
    this.pendingJerseyFile = null;
    this.countryForm.reset({
      countryCode: '',
      flagIcon: '',
      teamJersey: '',
    });
    this.loadAvailableCountries();
    this.showCountryModal();
  }

  /**
   * openEditModal function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  openEditModal(item: CountryItem): void {
    this.isEditMode = true;
    this.selectedUuid = item.uuid;
    this.revokeImageObjectUrls();
    this.flagObjectUrl = null;
    this.jerseyObjectUrl = null;
    this.pendingFlagFile = null;
    this.pendingJerseyFile = null;
    this.countryForm.patchValue({
      countryCode: item.countryCode,
      flagIcon: item.flagIcon || '',
      teamJersey: item.teamJersey || '',
    });
    this.showCountryModal();
  }

  /**
   * submitCountry – uploads pending images in one request (if any), then creates/updates country.
   */
  submitCountry(): void {
    if (this.countryForm.invalid || this.isSubmitting) {
      this.countryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const currentFlag = String(this.countryForm.value.flagIcon || '').trim();
    const currentJersey = String(this.countryForm.value.teamJersey || '').trim();
    const hasPending = this.pendingFlagFile || this.pendingJerseyFile;

    if (hasPending) {
      this.flagUploading = !!this.pendingFlagFile;
      this.jerseyUploading = !!this.pendingJerseyFile;
    }

    const doSave = (flagIcon: string, teamJersey: string) => {
      this.doSave$(flagIcon, teamJersey).subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Success', 'Success');
          this.closeModal();
          this.loadCountries();
        },
        error: (err: any) => {
          this.toastr.error(err?.error?.message || 'Unable to save country', 'Error');
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    };

    if (hasPending) {
      this.dataService
        .uploadCountryImages(this.pendingFlagFile ?? undefined, this.pendingJerseyFile ?? undefined)
        .subscribe({
          next: (res: any) => {
            this.flagUploading = false;
            this.jerseyUploading = false;
            const flagIcon = (res?.flagUrl ?? currentFlag).trim();
            const teamJersey = (res?.jerseyUrl ?? currentJersey).trim();
            doSave(flagIcon, teamJersey);
          },
          error: (err: any) => {
            this.flagUploading = false;
            this.jerseyUploading = false;
            this.isSubmitting = false;
            this.toastr.error(err?.error?.message || 'Image upload failed', 'Error');
          },
        });
    } else {
      doSave(currentFlag, currentJersey);
    }
  }

  /** Returns observable for create/update country (used after uploads). */
  private doSave$(flagIcon: string, teamJersey: string) {
    const payload: any = {
      countryCode: String(this.countryForm.value.countryCode || '').trim().toUpperCase(),
      flagIcon,
      teamJersey,
    };
    return this.isEditMode
      ? this.dataService.updateCountry(this.selectedUuid, {
          flagIcon: payload.flagIcon,
          teamJersey: payload.teamJersey,
        })
      : this.dataService.createCountry(payload);
  }

  /**
   * onStatusToggle function.
   * @param {*} event - Parameter.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  onStatusToggle(event: Event, item: CountryItem): void {
    event.preventDefault();
    this.pendingStatusUuid = item.uuid;
    this.pendingStatus = item.status === 1 ? 0 : 1;
    this.modalTitle = this.pendingStatus === 1 ? 'Activate Country' : 'Deactivate Country';
    this.modalMessage =
      this.pendingStatus === 0
        ? 'If you want to deactivate this country?'
        : `Do you want to activate ${item.countryName}?`;

    const modalElement = document.getElementById('changeCountryStatus');
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

    this.dataService.updateCountryStatus({ uuid, status }).subscribe({
      next: (res: any) => {
        const index = this.tableData.findIndex((item) => item.uuid === uuid);
        if (index !== -1) {
          this.tableData[index].status = status;
        }
        this.toastr.success(res?.message || 'Country status updated successfully', 'Success');
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update country status', 'Error');
      },
    });
  }

  /**
   * onFileChange – store selected file and show preview; upload happens on Save.
   */
  onFileChange(event: Event, field: 'flagIcon' | 'teamJersey'): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const isFlag = field === 'flagIcon';
    if (isFlag) {
      this.revokeUrl(this.flagObjectUrl);
      this.pendingFlagFile = file;
      this.flagObjectUrl = URL.createObjectURL(file);
      this.countryForm.patchValue({ flagIcon: '' });
    } else {
      this.revokeUrl(this.jerseyObjectUrl);
      this.pendingJerseyFile = file;
      this.jerseyObjectUrl = URL.createObjectURL(file);
      this.countryForm.patchValue({ teamJersey: '' });
    }
    input.value = '';
  }

  private revokeUrl(url: string | null): void {
    if (url) URL.revokeObjectURL(url);
  }

  private revokeImageObjectUrls(): void {
    this.revokeUrl(this.flagObjectUrl);
    this.revokeUrl(this.jerseyObjectUrl);
  }

  /**
   * closeModal function.
   * @returns {*} Result.
   */
  closeModal(): void {
    this.revokeImageObjectUrls();
    this.flagObjectUrl = null;
    this.jerseyObjectUrl = null;
    this.pendingFlagFile = null;
    this.pendingJerseyFile = null;
    const modalEl = document.getElementById('countryModal');
    if (!modalEl) {
      return;
    }
    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
    instance.hide();
  }

  /**
   * removeStaleModalBackdrop function.
   * @returns {*} Result.
   */
  private removeStaleModalBackdrop(): void {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
}
