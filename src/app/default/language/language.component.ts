import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatahandlerService } from '../../services/datahandler.service';
import { routes } from '../../shared/routes/routes';
import { ConfirmModalComponent } from '../../shared/common/confirm-modal/confirm-modal.component';
import { AuthService } from '../../services/auth.service';

declare const bootstrap: any;

interface LanguageItem {
  uuid: string;
  name: string;
  shortName: string;
  languageId: string;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-language',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ConfirmModalComponent],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss',
})
export class LanguageComponent {
  public routes = routes;
  public tableData: LanguageItem[] = [];
  public search = '';
  public isSubmitting = false;
  public isEditMode = false;
  public selectedUuid = '';
  public pendingStatusUuid: string | null = null;
  public pendingStatus: number | null = null;
  public modalTitle = 'Confirm';
  public modalMessage = 'Are you sure?';

  languageForm;

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
    this.languageForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      shortName: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.loadLanguages();
  }

  /**
   * filteredLanguages function.
   * @returns {*} Result.
   */
  get filteredLanguages(): LanguageItem[] {
    const keyword = this.search.trim().toLowerCase();
    if (!keyword) {
      return this.tableData;
    }
    return this.tableData.filter((item) =>
      [item.name, item.shortName, item.languageId]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }

  /**
   * loadLanguages function.
   * @returns {*} Result.
   */
  loadLanguages(): void {
    this.dataService.getLanguages().subscribe({
      next: (res: any) => {
        this.tableData = res?.data || [];
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch languages', 'Error');
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
    this.languageForm.reset({ name: '', shortName: '' });
  }

  /**
   * openEditModal function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  openEditModal(item: LanguageItem): void {
    this.isEditMode = true;
    this.selectedUuid = item.uuid;
    this.languageForm.patchValue({
      name: item.name,
      shortName: item.shortName,
    });
  }

  /**
   * submitLanguage function.
   * @returns {*} Result.
   */
  submitLanguage(): void {
    if (this.languageForm.invalid || this.isSubmitting) {
      this.languageForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = {
      name: String(this.languageForm.value.name || '').trim(),
      shortName: String(this.languageForm.value.shortName || '').trim(),
    };

    const request$ = this.isEditMode
      ? this.dataService.updateLanguage(this.selectedUuid, payload)
      : this.dataService.createLanguage(payload);

    request$.subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Success', 'Success');
        this.closeModal();
        this.loadLanguages();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to save language', 'Error');
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
  onStatusToggle(event: Event, item: LanguageItem): void {
    event.preventDefault();
    this.pendingStatusUuid = item.uuid;
    this.pendingStatus = item.status === 1 ? 0 : 1;
    this.modalTitle = this.pendingStatus === 1 ? 'Enable Language' : 'Disable Language';
    this.modalMessage = `Are you sure you want to ${this.pendingStatus === 1 ? 'enable' : 'disable'} language "${item.name}"?`;

    const modalElement = document.getElementById('changeLanguageStatus');
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

    this.dataService.updateLanguageStatus({ uuid, status }).subscribe({
      next: (res: any) => {
        const index = this.tableData.findIndex((item) => item.uuid === uuid);
        if (index !== -1) {
          this.tableData[index].status = status;
        }
        this.toastr.success(res?.message || 'Language status updated successfully', 'Success');
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update language status', 'Error');
      },
    });
  }

  /**
   * closeModal function.
   * @returns {*} Result.
   */
  closeModal(): void {
    const modalEl = document.getElementById('languageModal');
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
