import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routes } from '../../../../../shared/routes/routes';
import { DatahandlerService } from '../../../../../services/datahandler.service';
import { AuthService } from '../../../../../services/auth.service';

declare const bootstrap: any;

interface GuideActionPermissionSet {
  canCreateCategory: boolean;
  canUpdateCategory: boolean;
  canUpdateInfo: boolean;
  canManageDocs: boolean;
  canManageImages: boolean;
  canManageVideos: boolean;
  canDeleteMedia: boolean;
}

interface PageMediaRow {
  uuid: string;
  sNo: number;
  pageName: string;
  pagePathName: string;
  videoUrl: string;
  autoPlay: boolean;
}

type EditableField = 'pageName' | 'pagePathName' | 'videoUrl';

@Component({
  selector: 'app-page-videos-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page-videos-tab.component.html',
  styleUrl: './page-videos-tab.component.scss',
})
export class PageVideosTabComponent {
  @Input() permissionSet: GuideActionPermissionSet = {
    canCreateCategory: false,
    canUpdateCategory: false,
    canUpdateInfo: false,
    canManageDocs: false,
    canManageImages: false,
    canManageVideos: false,
    canDeleteMedia: false,
  };

  public routes = routes;

  rows: PageMediaRow[] = [];
  search = '';
  isLoading = false;
  isSubmitting = false;
  pagination = {
    currentPage: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
  };

  addForm = {
    pageName: '',
    pagePathName: '',
    videoUrl: '',
  };

  editFieldModalState: {
    row: PageMediaRow | null;
    field: EditableField;
    value: string;
    title: string;
  } = {
    row: null,
    field: 'pageName',
    value: '',
    title: 'Edit Value',
  };

  private readonly modalIds = {
    add: 'pageVideoAddModal',
    editField: 'pageVideoEditFieldModal',
    autoPlayConfirm: 'pageVideoAutoPlayConfirmModal',
  } as const;

  autoPlayConfirmTitle = 'Update Autoplay';
  autoPlayConfirmMessage = 'Are you sure you want to update autoplay setting?';
  pendingAutoPlayChange: { row: PageMediaRow; nextValue: boolean } | null = null;

  /**
   * constructor function.
   * @param {DatahandlerService} dataService - API service for page media operations.
   * @param {ToastrService} toastr - Toast service for user feedback.
   * @returns {void} Result.
   */
  constructor(
    private readonly dataService: DatahandlerService,
    private readonly toastr: ToastrService,
    private readonly authService: AuthService
  ) {}

  /**
   * ngOnInit function.
   * @returns {void} Result.
   */
  ngOnInit(): void {
    this.loadRows();
  }

  /**
   * canCreate function.
   * @returns {boolean} Result.
   */
  get canCreate(): boolean {
    return !!this.permissionSet?.canCreateCategory;
  }

  /**
   * canEditPageMeta function.
   * @returns {boolean} Result.
   */
  get canEditPageMeta(): boolean {
    return !!this.permissionSet?.canUpdateCategory;
  }

  /**
   * canToggleAutoPlay function.
   * @returns {boolean} Result.
   */
  get canToggleAutoPlay(): boolean {
    return !!this.permissionSet?.canUpdateInfo;
  }

  /**
   * canEditVideo function.
   * @returns {boolean} Result.
   */
  get canEditVideo(): boolean {
    return !!this.permissionSet?.canManageVideos;
  }

  /**
   * visibleRows function.
   * @returns {PageMediaRow[]} Result.
   */
  get visibleRows(): PageMediaRow[] {
    const keyword = String(this.search || '').trim().toLowerCase();
    if (!keyword) {
      return this.rows;
    }
    return this.rows.filter((row) =>
      `${row.pageName} ${row.pagePathName} ${row.videoUrl}`.toLowerCase().includes(keyword)
    );
  }

  /**
   * goBack function.
   * @returns {void} Result.
   */
  goBack(): void {
    history.back();
  }

  /**
   * changePage function.
   * @param {number} page - Page number.
   * @returns {void} Result.
   */
  changePage(page: number): void {
    const nextPage = Number(page) || 1;
    if (nextPage < 1 || nextPage > (this.pagination.totalPages || 1)) return;
    this.pagination.currentPage = nextPage;
    this.loadRows();
  }

  /**
   * loadRows function.
   * @returns {void} Result.
   */
  loadRows(): void {
    this.isLoading = true;
    this.dataService
      .getPageMediaList({
        page: this.pagination.currentPage,
        limit: this.pagination.limit,
        search: this.search?.trim() || '',
      })
      .subscribe({
        next: (res: any) => {
          const items = Array.isArray(res?.data) ? res.data : [];
          this.rows = items.map((item: any, index: number) => ({
            uuid: item.uuid,
            sNo: (this.pagination.currentPage - 1) * this.pagination.limit + index + 1,
            pageName: item.pageName || '',
            pagePathName: item.pagePathName || '',
            videoUrl: item.videoUrl || '',
            autoPlay: Boolean(item.autoPlay),
          }));

          const pagination = res?.pagination || {};
          this.pagination = {
            currentPage: Number(pagination?.currentPage || this.pagination.currentPage || 1),
            limit: Number(pagination?.limit || this.pagination.limit || 10),
            totalPages: Number(pagination?.totalPages || 0),
            totalRecords: Number(pagination?.totalRecords || 0),
          };
        },
        error: (err: any) => {
          this.toastr.error(err?.error?.message || 'Unable to load page videos', 'Error');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  /**
   * openAddModal function.
   * @returns {void} Result.
   */
  openAddModal(): void {
    this.addForm = {
      pageName: '',
      pagePathName: '',
      videoUrl: '',
    };
    this.openModal('add');
  }

  /**
   * saveAdd function.
   * @returns {void} Result.
   */
  saveAdd(): void {
    const pageName = String(this.addForm.pageName || '').trim();
    const pagePathName = this.normalizePath(this.addForm.pagePathName);
    const videoUrl = String(this.addForm.videoUrl || '').trim();

    if (!pageName || !pagePathName || !videoUrl) {
      this.toastr.error('Page name, page path and video URL are required', 'Error');
      return;
    }

    if (!this.isYoutubeUrl(videoUrl)) {
      this.toastr.error('Enter a valid YouTube URL', 'Error');
      return;
    }

    this.isSubmitting = true;
    this.dataService
      .createPageMedia({
        pageName,
        pagePathName,
        videoUrl,
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Page video added successfully', 'Success');
          const created = res?.data || {};
          this.syncPageMediaCache({
            pageName: created?.pageName || pageName,
            pagePathName: created?.pagePathName || pagePathName,
            videoUrl: created?.videoUrl || videoUrl,
            autoPlay: Boolean(created?.autoPlay),
          });
          this.closeModal('add');
          this.pagination.currentPage = 1;
          this.loadRows();
        },
        error: (err: any) => {
          this.toastr.error(err?.error?.message || 'Unable to create page video', 'Error');
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }

  /**
   * openEditFieldModal function.
   * @param {PageMediaRow} row - Selected row.
   * @param {EditableField} field - Editable field key.
   * @returns {void} Result.
   */
  openEditFieldModal(row: PageMediaRow, field: EditableField): void {
    const isPageName = field === 'pageName';
    const isPagePath = field === 'pagePathName';
    this.editFieldModalState = {
      row,
      field,
      value: isPageName ? row.pageName : isPagePath ? row.pagePathName : row.videoUrl,
      title: isPageName ? 'Edit Page Name' : isPagePath ? 'Edit Page URL' : 'Edit Page Video URL',
    };
    this.openModal('editField');
  }

  /**
   * saveEditField function.
   * @returns {void} Result.
   */
  saveEditField(): void {
    const row = this.editFieldModalState.row;
    if (!row?.uuid) return;

    const payload: any = {};
    if (this.editFieldModalState.field === 'pageName') {
      const pageName = String(this.editFieldModalState.value || '').trim();
      if (!pageName) {
        this.toastr.error('Page name is required', 'Error');
        return;
      }
      payload.pageName = pageName;
    } else if (this.editFieldModalState.field === 'pagePathName') {
      const pagePathName = this.normalizePath(this.editFieldModalState.value);
      if (!pagePathName) {
        this.toastr.error('Page URL is required', 'Error');
        return;
      }
      payload.pagePathName = pagePathName;
    } else {
      const videoUrl = String(this.editFieldModalState.value || '').trim();
      if (!videoUrl) {
        this.toastr.error('Page video URL is required', 'Error');
        return;
      }
      if (!this.isYoutubeUrl(videoUrl)) {
        this.toastr.error('Enter a valid YouTube URL', 'Error');
        return;
      }
      payload.videoUrl = videoUrl;
    }

    this.isSubmitting = true;
    this.dataService.updatePageMedia(row.uuid, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Page media updated successfully', 'Success');
        const updated = res?.data || {};
        const nextRow = {
          ...row,
          pageName: updated?.pageName || payload?.pageName || row.pageName,
          pagePathName: updated?.pagePathName || payload?.pagePathName || row.pagePathName,
          videoUrl: updated?.videoUrl || payload?.videoUrl || row.videoUrl,
          autoPlay: typeof updated?.autoPlay === 'boolean' ? updated.autoPlay : row.autoPlay,
        };
        this.syncPageMediaCache({
          pageName: nextRow.pageName,
          pagePathName: nextRow.pagePathName,
          videoUrl: nextRow.videoUrl,
          autoPlay: nextRow.autoPlay,
        });
        this.closeModal('editField');
        this.loadRows();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update page media', 'Error');
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  /**
   * onAutoPlayToggleIntent function.
   * @param {PageMediaRow} row - Selected row.
   * @param {*} event - Toggle event.
   * @returns {void} Result.
   */
  onAutoPlayToggleIntent(row: PageMediaRow, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextValue = Boolean(input?.checked);
    if (input) {
      input.checked = Boolean(row.autoPlay);
    }
    this.pendingAutoPlayChange = { row, nextValue };
    this.autoPlayConfirmTitle = nextValue ? 'Enable Autoplay' : 'Disable Autoplay';
    this.autoPlayConfirmMessage = nextValue
      ? 'Are you sure you want to enable autoplay for this page video?'
      : 'Are you sure you want to disable autoplay for this page video?';
    this.openModal('autoPlayConfirm');
  }

  /**
   * confirmAutoPlayChange function.
   * @returns {void} Result.
   */
  confirmAutoPlayChange(): void {
    const payload = this.pendingAutoPlayChange;
    if (!payload?.row?.uuid) {
      this.closeModal('autoPlayConfirm');
      return;
    }
    const row = payload.row;
    const nextValue = Boolean(payload.nextValue);
    const previousValue = Boolean(row.autoPlay);
    row.autoPlay = nextValue;

    this.dataService
      .updatePageMediaAutoPlay({ uuid: row.uuid, autoPlay: nextValue })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Auto play updated successfully', 'Success');
          this.syncPageMediaCache({
            pageName: row.pageName,
            pagePathName: row.pagePathName,
            videoUrl: row.videoUrl,
            autoPlay: nextValue,
          });
        },
        error: (err: any) => {
          row.autoPlay = previousValue;
          this.toastr.error(err?.error?.message || 'Unable to update auto play', 'Error');
        },
        complete: () => {
          this.pendingAutoPlayChange = null;
          this.closeModal('autoPlayConfirm');
        },
      });
  }

  /**
   * openModal function.
   * @param {keyof typeof this.modalIds} key - Modal key.
   * @returns {void} Result.
   */
  private openModal(key: keyof typeof this.modalIds): void {
    const element = document.getElementById(this.modalIds[key]);
    if (!element) return;
    bootstrap.Modal.getOrCreateInstance(element).show();
  }

  /**
   * closeModal function.
   * @param {keyof typeof this.modalIds} key - Modal key.
   * @returns {void} Result.
   */
  closeModal(key: keyof typeof this.modalIds): void {
    const element = document.getElementById(this.modalIds[key]);
    if (!element) return;
    bootstrap.Modal.getOrCreateInstance(element).hide();
    if (key === 'autoPlayConfirm') {
      this.pendingAutoPlayChange = null;
    }
  }

  /**
   * normalizePath function.
   * @param {*} value - Parameter.
   * @returns {string} Result.
   */
  private normalizePath(value: any): string {
    let path = String(value || '').trim();
    if (!path) return '';
    if (!path.startsWith('/')) path = `/${path}`;
    path = path.replace(/\/{2,}/g, '/');
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path;
  }

  /**
   * isYoutubeUrl function.
   * @param {*} value - Parameter.
   * @returns {boolean} Result.
   */
  private isYoutubeUrl(value: any): boolean {
    const url = String(value || '').trim();
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[\w-]{6,}|youtu\.be\/[\w-]{6,})([&?][^\s]*)?$/i;
    return regex.test(url);
  }

  /**
   * syncPageMediaCache function.
   * @param {*} item - Parameter.
   * @returns {void} Result.
   */
  private syncPageMediaCache(item: {
    pageName: string;
    pagePathName: string;
    videoUrl: string;
    autoPlay: boolean;
  }): void {
    const user: any = this.authService.currentUser;
    if (!user) return;

    const normalizedPath = this.normalizePath(item?.pagePathName);
    if (!normalizedPath) return;

    const currentList = Array.isArray(user?.pageMedia) ? [...user.pageMedia] : [];
    const filtered = currentList.filter(
      (media: any) => this.normalizePath(media?.pagePathName) !== normalizedPath
    );

    filtered.push({
      pageName: String(item?.pageName || '').trim(),
      pagePathName: normalizedPath,
      videoUrl: String(item?.videoUrl || '').trim(),
      autoPlay: Boolean(item?.autoPlay),
    });

    this.authService.login({
      ...user,
      pageMedia: filtered,
    });
  }
}
