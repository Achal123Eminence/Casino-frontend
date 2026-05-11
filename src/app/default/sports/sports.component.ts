import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../shared/common/confirm-modal/confirm-modal.component';
import { DatahandlerService } from '../../services/datahandler.service';
import { routes } from '../../shared/routes/routes';
import { AuthService } from '../../services/auth.service';

declare const bootstrap: any;

interface SportType {
  id: number;
  name: string;
}

interface ReservedSport {
  sportId: number;
  sportName: string;
}

interface SportItem {
  uuid: string;
  sportName: string;
  sportId: number;
  type: number;
  isDynamic: number;
  status: number;
}

@Component({
  selector: 'app-sports',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.scss',
})
export class SportsComponent {
  public routes = routes;
  public sportTypes: SportType[] = [];
  public reservedSports: ReservedSport[] = [];
  public tableData: SportItem[] = [];
  public search = '';
  public activeType = 1;
  public isSubmitting = false;
  public isEditMode = false;
  public selectedUuid = '';
  public pendingStatusUuid: string | null = null;
  public pendingStatus: number | null = null;
  public modalTitle = 'Confirm';
  public modalMessage = 'Are you sure?';

  sportForm;

  /**
   * constructor function.
   * @param {*} fb - Parameter.
   * @param {*} dataService - Parameter.
   * @param {*} toastr - Parameter.
   * @returns {*} Result.
   */
  constructor(
    private fb: UntypedFormBuilder,
    private dataService: DatahandlerService,
    private toastr: ToastrService,
    public auth: AuthService
  ) {
    this.sportForm = this.fb.group({
      sportName: ['', [Validators.required, Validators.maxLength(50)]],
      sportId: [null, [Validators.required, Validators.min(1)]],
      type: [1, [Validators.required]],
      isDynamic: [1, [Validators.required]],
    });
  }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    this.loadSportTypes();
    this.loadReservedSports();
  }

  /**
   * filteredSports function.
   * @returns {*} Result.
   */
  get filteredSports(): SportItem[] {
    const keyword = this.search.trim().toLowerCase();
    if (!keyword) {
      return this.tableData;
    }
    return this.tableData.filter((item) =>
      [item.sportName, String(item.sportId)].join(' ').toLowerCase().includes(keyword)
    );
  }

  /**
   * loadSportTypes function.
   * @returns {*} Result.
   */
  loadSportTypes(): void {
    this.dataService.getSportTypes().subscribe({
      next: (res: any) => {
        this.sportTypes = res?.data || [];
        this.activeType = this.sportTypes[0]?.id ?? 1;
        this.loadSports();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch sport types', 'Error');
      },
    });
  }

  /**
   * loadReservedSports function.
   * @returns {*} Result.
   */
  loadReservedSports(): void {
    this.dataService.getReservedSports().subscribe({
      next: (res: any) => {
        this.reservedSports = res?.data || [];
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch reserved sports', 'Error');
      },
    });
  }

  /**
   * loadSports function.
   * @returns {*} Result.
   */
  loadSports(): void {
    this.dataService.getSports({ type: this.activeType }).subscribe({
      next: (res: any) => {
        this.tableData = res?.data || [];
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to fetch sports', 'Error');
      },
    });
  }

  /**
   * changeTypeTab function.
   * @param {*} type - Parameter.
   * @returns {*} Result.
   */
  changeTypeTab(type: number): void {
    this.activeType = type;
    this.search = '';
    this.loadSports();
  }

  /**
   * getTypeName function.
   * @param {*} typeId - Parameter.
   * @returns {*} Result.
   */
  getTypeName(typeId: number): string {
    const foundType = this.sportTypes.find((type) => type.id === typeId);
    return foundType ? foundType.name : String(typeId);
  }

  /**
   * openAddModal function.
   * @returns {*} Result.
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedUuid = '';
    this.sportForm.reset({
      sportName: '',
      sportId: null,
      type: this.activeType,
      isDynamic: 1,
    });
  }

  /**
   * openEditModal function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  openEditModal(item: SportItem): void {
    this.isEditMode = true;
    this.selectedUuid = item.uuid;
    this.sportForm.patchValue({
      sportName: item.sportName,
      sportId: item.sportId,
      type: item.type,
      isDynamic: item.isDynamic,
    });
  }

  /**
   * submitSport function.
   * @returns {*} Result.
   */
  submitSport(): void {
    if (this.sportForm.invalid || this.isSubmitting) {
      this.sportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = {
      sportName: String(this.sportForm.value.sportName || '').trim().toLowerCase(),
      sportId: Number(this.sportForm.value.sportId),
      type: Number(this.sportForm.value.type),
      isDynamic: Number(this.sportForm.value.isDynamic),
    };

    const request$ = this.isEditMode
      ? this.dataService.updateSport(this.selectedUuid, payload)
      : this.dataService.createSport(payload);

    request$.subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Success', 'Success');
        this.closeModal();
        this.changeTypeTab(payload.type);
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to save sport', 'Error');
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
  onStatusToggle(event: Event, item: SportItem): void {
    event.preventDefault();
    this.pendingStatusUuid = item.uuid;
    this.pendingStatus = item.status === 1 ? 0 : 1;
    this.modalTitle = this.pendingStatus === 1 ? 'Enable Sport' : 'Disable Sport';
    this.modalMessage =
      this.pendingStatus === 0
        ? `Do you want to deactivate ${item.sportName}?`
        : `Do you want to activate ${item.sportName}?`;

    const modalElement = document.getElementById('changeSportStatus');
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

    this.dataService.updateSportStatus({ uuid, status }).subscribe({
      next: (res: any) => {
        const index = this.tableData.findIndex((item) => item.uuid === uuid);
        if (index !== -1) {
          this.tableData[index].status = status;
        }
        this.toastr.success(res?.message || 'Sport status updated successfully', 'Success');
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update sport status', 'Error');
      },
    });
  }

  /**
   * closeModal function.
   * @returns {*} Result.
   */
  closeModal(): void {
    const modalEl = document.getElementById('sportModal');
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
