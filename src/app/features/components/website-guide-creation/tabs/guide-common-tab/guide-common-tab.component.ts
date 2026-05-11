import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { routes } from '../../../../../shared/routes/routes';
import { DatahandlerService } from '../../../../../services/datahandler.service';
import { AuthService } from '../../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

declare const bootstrap: any;

type SubTab = 'management' | 'user';
type GuideType = 'WEBSITE_GUIDE' | 'DEVELOPER_GUIDE';
type MediaType = 'doc' | 'image' | 'video';

interface GuideRow {
  uuid: string;
  sNo: number;
  categoryName: string;
  note: string;
  docs: string[];
  images: string[];
  videos: string[];
}

interface GuideBreadcrumb {
  uuid: string;
  name: string;
}

interface GuideActionPermissionSet {
  canCreateCategory: boolean;
  canUpdateCategory: boolean;
  canUpdateInfo: boolean;
  canManageDocs: boolean;
  canManageImages: boolean;
  canManageVideos: boolean;
  canDeleteMedia: boolean;
}

@Component({
  selector: 'app-guide-common-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LightboxModule],
  templateUrl: './guide-common-tab.component.html',
  styleUrl: './guide-common-tab.component.scss',
})
export class GuideCommonTabComponent {
  @Input() guideType: GuideType = 'WEBSITE_GUIDE';
  @Input() pageTitle = 'Website Guide';
  @Input() permissionSet: GuideActionPermissionSet = {
    canCreateCategory: true,
    canUpdateCategory: true,
    canUpdateInfo: true,
    canManageDocs: true,
    canManageImages: true,
    canManageVideos: true,
    canDeleteMedia: true,
  };
  public routes = routes;
  private readonly apiBaseUrl = String((environment as any)?.baseUrl || '').trim().replace(/\/+$/g, '');
  private readonly apiOrigin = this.apiBaseUrl.replace(/\/api\/v1$/i, '');
  private readonly imageCdnHost = String((environment as any)?.cloudflareImageHost || '').trim();
  activeSubTab: SubTab = 'management';
  currentParentUuid = '';
  currentParentName = 'Root';
  breadcrumb: GuideBreadcrumb[] = [{ uuid: '', name: 'Root' }];
  tableData: GuideRow[] = [];
  search = '';
  isSubmitting = false;
  isEditMode = false;

  readonly subTabs: { id: SubTab; title: string }[] = [
    { id: 'management', title: 'Management' },
    { id: 'user', title: 'User' },
  ];
  readonly mediaSlots = [0, 1, 2, 3];

  selectedRow: GuideRow | null = null;
  editableCategoryName = '';
  newCategoryName = '';
  editableNote = '';
  editableDocs: string[] = ['', '', '', ''];
  editableVideos: string[] = ['', '', '', ''];
  editableImages: string[] = ['', '', '', ''];
  imagePreviewUrls: string[] = ['', '', '', ''];
  docPreviewUrls: string[] = ['', '', '', ''];
  pendingImageFiles: Array<File | null> = [null, null, null, null];
  pendingDocFiles: Array<File | null> = [null, null, null, null];
  imageUploading: boolean[] = [false, false, false, false];
  docUploading: boolean[] = [false, false, false, false];
  selectedExportType: 'csv' | 'pdf' = 'csv';
  activeVideoUrl: SafeResourceUrl | null = null;
  removeMediaTitle = 'Remove Media';
  removeMediaMessage = 'Are you sure you want to remove this media item?';
  private pendingMediaRemoval: { row: GuideRow; type: MediaType; index: number } | null = null;

  private readonly modalIds = {
    video: 'guideCommonVideoModal',
    youtube: 'guideCommonYoutubeModal',
    info: 'guideCommonInfoModal',
    doc: 'guideCommonDocModal',
    image: 'guideCommonImageModal',
    edit: 'guideCommonEditModal',
    add: 'guideCommonAddModal',
    export: 'guideCommonExportModal',
    removeMedia: 'guideCommonRemoveMediaModal',
  } as const;

  /**
   * constructor function.
   * @param {Location} location - Browser location service for back navigation.
   * @param {DatahandlerService} dataService - HTTP service for common-service APIs.
   * @param {ToastrService} toastr - Toast service for success/error alerts.
   * @returns {void} Result.
   */
  constructor(
    private readonly location: Location,
    private readonly dataService: DatahandlerService,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly lightbox: Lightbox,
    private readonly sanitizer: DomSanitizer
  ) {}

  /**
   * ngOnInit function.
   * @returns {void} Result.
   */
  ngOnInit(): void {
    this.loadRows();
  }

  /**
   * filteredRows function.
   * @returns {GuideRow[]} Result.
   */
  get filteredRows(): GuideRow[] {
    const keyword = this.search.trim().toLowerCase();
    if (!keyword) {
      return this.tableData;
    }
    return this.tableData.filter((row) =>
      [row.categoryName, row.note, ...row.docs, ...row.images, ...row.videos]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }

  /**
   * isDocUploading function.
   * @returns {boolean} Result.
   */
  get isDocUploading(): boolean {
    return this.docUploading.some((flag) => !!flag);
  }

  /**
   * isImageUploading function.
   * @returns {boolean} Result.
   */
  get isImageUploading(): boolean {
    return this.imageUploading.some((flag) => !!flag);
  }

  /**
   * addModalTitle function.
   * @returns {string} Result.
   */
  get addModalTitle(): string {
    return this.currentParentUuid ? `Add Subcategory in ${this.currentParentName}` : 'Add Category';
  }

  /**
   * addButtonLabel function.
   * @returns {string} Result.
   */
  get addButtonLabel(): string {
    return this.currentParentUuid ? 'Add Sub Category' : 'Add Category';
  }

  /**
   * canOpenAdd function.
   * @returns {boolean} Result.
   */
  get canOpenAdd(): boolean {
    return !!this.permissionSet?.canCreateCategory;
  }

  /**
   * canEditCategory function.
   * @returns {boolean} Result.
   */
  get canEditCategory(): boolean {
    return !!this.permissionSet?.canUpdateCategory;
  }

  /**
   * canEditInfo function.
   * @returns {boolean} Result.
   */
  get canEditInfo(): boolean {
    return !!this.permissionSet?.canUpdateInfo;
  }

  /**
   * canEditDocs function.
   * @returns {boolean} Result.
   */
  get canEditDocs(): boolean {
    return !!this.permissionSet?.canManageDocs;
  }

  /**
   * canEditImages function.
   * @returns {boolean} Result.
   */
  get canEditImages(): boolean {
    return !!this.permissionSet?.canManageImages;
  }

  /**
   * canEditVideos function.
   * @returns {boolean} Result.
   */
  get canEditVideos(): boolean {
    return !!this.permissionSet?.canManageVideos;
  }

  /**
   * canRemoveMedia function.
   * @returns {boolean} Result.
   */
  get canRemoveMedia(): boolean {
    return !!this.permissionSet?.canDeleteMedia;
  }

  /**
   * hasAnyActions function.
   * @returns {boolean} Result.
   */
  get hasAnyActions(): boolean {
    return this.canEditCategory || this.canEditInfo || this.canEditDocs || this.canEditImages || this.canEditVideos;
  }

  /**
   * isOwnerUser function.
   * @returns {boolean} Result.
   */
  get isOwnerUser(): boolean {
    const user: any = this.authService.currentUser;
    const level = Number(user?.level ?? user?.userLevel?.level ?? user?.userLevelId?.level ?? 0);
    return level === 1;
  }

  /**
   * visibleColumnCount function.
   * @returns {number} Result.
   */
  get visibleColumnCount(): number {
    return this.isOwnerUser ? 6 : 5;
  }

  /**
   * setSubTab function.
   * @param {SubTab} tab - Selected sub-tab key.
   * @returns {void} Result.
   */
  setSubTab(tab: SubTab): void {
    this.activeSubTab = tab;
    this.resetHierarchyContext();
    this.loadRows();
  }

  /**
   * goBack function.
   * @returns {void} Result.
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * loadRows function.
   * @returns {void} Result.
   */
  loadRows(): void {
    const params: any = {
      guideType: this.guideType,
      audience: this.activeSubTab.toUpperCase(),
    };
    if (this.currentParentUuid) {
      params.parentUuid = this.currentParentUuid;
    }

    this.dataService
      .getWebsiteGuideCategories(params)
      .subscribe({
        next: (res: any) => {
          const rows = Array.isArray(res?.data) ? res.data : [];
          const breadcrumb = Array.isArray(res?.breadcrumb) ? res.breadcrumb : [];
          this.breadcrumb = breadcrumb.length ? breadcrumb : [{ uuid: '', name: 'Root' }];
          const activeNode = this.breadcrumb[this.breadcrumb.length - 1];
          this.currentParentUuid = activeNode?.uuid || '';
          this.currentParentName = activeNode?.name || 'Root';
          this.tableData = rows.map((item: any, index: number) => ({
            uuid: item.uuid,
            sNo: index + 1,
            categoryName: item.name || '',
            note: item.note || '',
            docs: Array.from({ length: 4 }, (_, i) => item.docs?.[i]?.pathname || ''),
            images: Array.from({ length: 4 }, (_, i) => item.images?.[i]?.pathname || ''),
            videos: Array.from({ length: 4 }, (_, i) => item.videos?.[i]?.videoUrl || ''),
          }));
        },
        error: (err: any) => {
          this.toastr.error(
            err?.error?.message || `Unable to fetch ${this.pageTitle.toLowerCase()} categories`,
            'Error'
          );
        },
      });
  }

  /**
   * enterCategory function.
   * @param {GuideRow} row - Selected row to open as parent.
   * @returns {void} Result.
   */
  enterCategory(row: GuideRow): void {
    if (!row?.uuid) return;
    this.currentParentUuid = row.uuid;
    this.currentParentName = row.categoryName || 'Category';
    this.loadRows();
  }

  /**
   * goToHierarchyLevel function.
   * @param {GuideBreadcrumb} item - Breadcrumb node.
   * @returns {void} Result.
   */
  goToHierarchyLevel(item: GuideBreadcrumb): void {
    this.currentParentUuid = String(item?.uuid || '').trim();
    this.currentParentName = String(item?.name || 'Root').trim() || 'Root';
    this.loadRows();
  }

  /**
   * resetHierarchyContext function.
   * @returns {void} Result.
   */
  private resetHierarchyContext(): void {
    this.currentParentUuid = '';
    this.currentParentName = 'Root';
    this.breadcrumb = [{ uuid: '', name: 'Root' }];
  }

  /**
   * openVideoModal function.
   * @param {GuideRow} row - Row selected for video link edit.
   * @returns {void} Result.
   */
  openVideoModal(row: GuideRow): void {
    if (!this.canEditVideos) {
      this.toastr.error('You do not have permission to edit videos', 'Error');
      return;
    }
    this.selectedRow = row;
    this.editableVideos = this.mediaSlots.map((slot) => row.videos?.[slot] || '');
    this.showModal(this.modalIds.video);
  }

  /**
   * openDocAtIndex function.
   * @param {GuideRow} row - Row selected for document preview.
   * @param {number} index - Document slot index.
   * @returns {void} Result.
   */
  openDocAtIndex(row: GuideRow, index: number): void {
    const docPath = String(row.docs?.[index] || '').trim();
    if (!docPath) return;
    this.openPdfInNewTab(docPath);
  }

  /**
   * openVideoAtIndex function.
   * @param {GuideRow} row - Row selected for video preview.
   * @param {number} index - Video slot index.
   * @returns {void} Result.
   */
  openVideoAtIndex(row: GuideRow, index: number): void {
    const videoUrl = String(row.videos?.[index] || '').trim();
    if (!videoUrl) return;
    this.openYoutubeModal(videoUrl);
  }

  /**
   * hasMediaAtSlot function.
   * @param {GuideRow} row - Row selected for media check.
   * @param {MediaType} type - Media type.
   * @param {number} index - Slot index.
   * @returns {boolean} Result.
   */
  hasMediaAtSlot(row: GuideRow, type: MediaType, index: number): boolean {
    const value =
      type === 'doc' ? row.docs?.[index] :
      type === 'image' ? row.images?.[index] :
      row.videos?.[index];
    return !!String(value || '').trim();
  }

  /**
   * openRemoveMediaModal function.
   * @param {GuideRow} row - Row selected for media removal.
   * @param {MediaType} type - Media type.
   * @param {number} index - Slot index.
   * @param {MouseEvent} event - Click event from remove icon.
   * @returns {void} Result.
   */
  openRemoveMediaModal(row: GuideRow, type: MediaType, index: number, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.canRemoveMedia) {
      this.toastr.error('You do not have permission to remove media', 'Error');
      return;
    }
    if (!this.hasMediaAtSlot(row, type, index)) return;

    this.pendingMediaRemoval = { row, type, index };
    this.removeMediaTitle = `Remove ${type === 'doc' ? 'Document' : type === 'image' ? 'Image' : 'Video'}`;
    this.removeMediaMessage = `Are you sure you want to remove ${type} ${index + 1}?`;
    this.showModal(this.modalIds.removeMedia);
  }

  /**
   * confirmRemoveMedia function.
   * @returns {void} Result.
   */
  confirmRemoveMedia(): void {
    if (!this.pendingMediaRemoval) return;
    const { row, type, index } = this.pendingMediaRemoval;

    const docs = [...(row.docs || [])];
    const images = [...(row.images || [])];
    const videos = [...(row.videos || [])];

    if (type === 'doc') docs[index] = '';
    if (type === 'image') images[index] = '';
    if (type === 'video') videos[index] = '';

    const payload = {
      docs: docs
        .map((pathname) => this.normalizeDocPathForPayload(pathname))
        .filter((pathname) => pathname)
        .map((pathname) => ({ pathname })),
      images: images
        .map((pathname) => String(pathname || '').trim())
        .filter((pathname) => pathname)
        .map((pathname) => ({ pathname })),
      videos: videos
        .map((videoUrl) => String(videoUrl || '').trim())
        .filter((videoUrl) => videoUrl)
        .map((videoUrl) => ({ videoUrl })),
    };

    this.dataService.updateWebsiteGuideCategory(row.uuid, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Media removed', 'Success');
        this.pendingMediaRemoval = null;
        this.hideModal(this.modalIds.removeMedia);
        this.loadRows();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to remove media', 'Error');
      },
    });
  }

  /**
   * getImageDisplayUrl function.
   * @param {string} pathname - Stored image pathname.
   * @returns {string} Result.
   */
  getImageDisplayUrl(pathname: string): string {
    const value = String(pathname || '').trim();
    if (!value) return '';
    if (/^(https?:\/\/|blob:|data:)/i.test(value)) return value;
    if (!this.imageCdnHost) return value;
    const host = this.imageCdnHost.replace(/\/+$/g, '');
    const path = value.replace(/^\/+/g, '');
    return `${host}/${path}`;
  }

  /**
   * getDocumentDisplayUrl function.
   * @param {string} pathname - Stored document pathname.
   * @returns {string} Result.
   */
  getDocumentDisplayUrl(pathname: string): string {
    const value = String(pathname || '').trim();
    if (!value) return '';
    if (/^(https?:\/\/|blob:|data:)/i.test(value)) return value;
    if (value.startsWith('/api/')) {
      return this.apiOrigin ? `${this.apiOrigin}${value}` : value;
    }
    if (this.apiBaseUrl && value.startsWith('/')) {
      return `${this.apiBaseUrl}/upload/doc${value}`;
    }
    return this.getImageDisplayUrl(value);
  }

  /**
   * getPdfInlinePreviewUrl function.
   * @param {string} pathname - Stored document pathname.
   * @returns {SafeResourceUrl | null} Result.
   */
  getPdfInlinePreviewUrl(pathname: string): SafeResourceUrl | null {
    const displayUrl = this.getDocumentDisplayUrl(pathname);
    if (!displayUrl) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `${displayUrl}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`
    );
  }

  /**
   * openPdfInNewTab function.
   * @param {string} pathname - Stored document pathname.
   * @returns {void} Result.
   */
  openPdfInNewTab(pathname: string): void {
    const displayUrl = this.getDocumentDisplayUrl(pathname);
    if (!displayUrl) return;
    const sanitizedUrl = `${displayUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    window.open(sanitizedUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * openImagePreview function.
   * @param {GuideRow} row - Selected row with images.
   * @param {number} index - Preferred clicked image index.
   * @returns {void} Result.
   */
  openImagePreview(row: GuideRow, index: number): void {
    const album = row.images
      .filter((imagePath) => String(imagePath || '').trim())
      .map((imagePath) => {
        const displayUrl = this.getImageDisplayUrl(imagePath);
        return { src: displayUrl, thumb: displayUrl };
      });

    if (!album.length) return;

    const clickedUrl = this.getImageDisplayUrl(row.images[index] || '');
    const lightboxIndex = Math.max(0, album.findIndex((item) => item.src === clickedUrl));
    this.lightbox.open(album, lightboxIndex);
  }

  /**
   * getYoutubeId function.
   * @param {string} videoUrl - YouTube URL.
   * @returns {string} Result.
   */
  getYoutubeId(videoUrl: string): string {
    const value = String(videoUrl || '').trim();
    if (!value) return '';
    const patterns = [
      /[?&]v=([a-zA-Z0-9_-]{6,})/,
      /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
    ];
    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (match?.[1]) return match[1];
    }
    return '';
  }

  /**
   * getYoutubeThumbnail function.
   * @param {string} videoUrl - YouTube URL.
   * @returns {string} Result.
   */
  getYoutubeThumbnail(videoUrl: string): string {
    const videoId = this.getYoutubeId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  }

  /**
   * openYoutubeModal function.
   * @param {string} videoUrl - YouTube URL.
   * @returns {void} Result.
   */
  openYoutubeModal(videoUrl: string): void {
    const videoId = this.getYoutubeId(videoUrl);
    if (!videoId) return;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    this.activeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.showBootstrapModal(this.modalIds.youtube);
  }

  /**
   * openInfoModal function.
   * @param {GuideRow} row - Row selected for note and docs edit.
   * @returns {void} Result.
   */
  openInfoModal(row: GuideRow): void {
    if (!this.canEditInfo) {
      this.toastr.error('You do not have permission to update info', 'Error');
      return;
    }
    this.selectedRow = row;
    this.editableNote = row.note || '';
    this.showModal(this.modalIds.info);
  }

  /**
   * openDocModal function.
   * @param {GuideRow} row - Row selected for doc upload.
   * @returns {void} Result.
   */
  openDocModal(row: GuideRow): void {
    if (!this.canEditDocs) {
      this.toastr.error('You do not have permission to manage docs', 'Error');
      return;
    }
    this.selectedRow = row;
    this.clearDocPreviewUrls();
    this.editableDocs = this.mediaSlots.map((slot) => row.docs?.[slot] || '');
    this.docPreviewUrls = this.mediaSlots.map((slot) => this.getDocumentDisplayUrl(row.docs?.[slot] || ''));
    this.pendingDocFiles = [null, null, null, null];
    this.docUploading = [false, false, false, false];
    this.showModal(this.modalIds.doc);
  }

  /**
   * openImageModal function.
   * @param {GuideRow} row - Row selected for image path edit.
   * @returns {void} Result.
   */
  openImageModal(row: GuideRow): void {
    if (!this.canEditImages) {
      this.toastr.error('You do not have permission to manage images', 'Error');
      return;
    }
    this.selectedRow = row;
    this.clearImagePreviewUrls();
    this.editableImages = this.mediaSlots.map((slot) => row.images?.[slot] || '');
    this.imagePreviewUrls = this.mediaSlots.map((slot) => this.getImageDisplayUrl(row.images?.[slot] || ''));
    this.pendingImageFiles = [null, null, null, null];
    this.imageUploading = [false, false, false, false];
    this.showModal(this.modalIds.image);
  }

  /**
   * openEditModal function.
   * @param {GuideRow} row - Row selected for category name edit.
   * @returns {void} Result.
   */
  openEditModal(row: GuideRow): void {
    if (!this.canEditCategory) {
      this.toastr.error('You do not have permission to update category', 'Error');
      return;
    }
    this.selectedRow = row;
    this.isEditMode = true;
    this.editableCategoryName = row.categoryName;
    this.showModal(this.modalIds.edit);
  }

  /**
   * openAddModal function.
   * @returns {void} Result.
   */
  openAddModal(): void {
    if (!this.canOpenAdd) {
      this.toastr.error('You do not have permission to create category', 'Error');
      return;
    }
    this.isEditMode = false;
    this.newCategoryName = '';
    this.showModal(this.modalIds.add);
  }

  /**
   * openExportModal function.
   * @returns {void} Result.
   */
  openExportModal(): void {
    this.selectedExportType = 'csv';
    this.showModal(this.modalIds.export);
  }

  /**
   * saveVideos function.
   * @returns {void} Result.
   */
  saveVideos(): void {
    if (!this.canEditVideos) return;
    if (!this.selectedRow) return;

    const payload = {
      videos: this.editableVideos
        .map((videoUrl) => String(videoUrl || '').trim())
        .filter((videoUrl) => videoUrl)
        .map((videoUrl) => ({ videoUrl })),
    };

    this.dataService.updateWebsiteGuideCategory(this.selectedRow.uuid, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Videos updated', 'Success');
        this.hideModal(this.modalIds.video);
        this.loadRows();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update videos', 'Error');
      },
    });
  }

  /**
   * saveInfo function.
   * @returns {void} Result.
   */
  saveInfo(): void {
    if (!this.canEditInfo) return;
    if (!this.selectedRow) return;

    const payload = {
      note: this.editableNote.trim(),
    };

    this.dataService.updateWebsiteGuideCategory(this.selectedRow.uuid, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Info updated', 'Success');
        this.hideModal(this.modalIds.info);
        this.loadRows();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update info', 'Error');
      },
    });
  }

  /**
   * saveDocs function.
   * @returns {void} Result.
   */
  saveDocs(): void {
    if (!this.canEditDocs) return;
    if (!this.selectedRow) return;
    const pendingIndexes = this.pendingDocFiles
      .map((file, index) => (file ? index : -1))
      .filter((index) => index >= 0);

    if (!pendingIndexes.length) {
      this.persistDocs();
      return;
    }

    pendingIndexes.forEach((index) => {
      this.docUploading[index] = true;
    });

    const uploads$ = pendingIndexes.map((index) =>
      this.dataService
        .uploadWebsiteGuideDoc(this.pendingDocFiles[index] as File, this.buildUploadFolder('docs'))
        .pipe(
          map((res: any) => ({
            index,
            pathname: String(res?.docPathname || '').trim(),
            docUrl: String(res?.docUrl || '').trim(),
          }))
        )
    );

    forkJoin(uploads$).subscribe({
      next: (results) => {
        results.forEach(({ index, pathname, docUrl }) => {
          const persistedValue = docUrl || pathname || this.extractDocPathFromUrl(docUrl);
          if (persistedValue) {
            this.editableDocs[index] = persistedValue;
            this.docPreviewUrls[index] = docUrl || this.getDocumentDisplayUrl(persistedValue);
          }
        });
        this.persistDocs();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'PDF upload failed', 'Error');
        pendingIndexes.forEach((index) => {
          this.docUploading[index] = false;
        });
      },
    });
  }

  /**
   * saveImages function.
   * @returns {void} Result.
   */
  saveImages(): void {
    if (!this.canEditImages) return;
    if (!this.selectedRow) return;
    const pendingIndexes = this.pendingImageFiles
      .map((file, index) => (file ? index : -1))
      .filter((index) => index >= 0);

    if (!pendingIndexes.length) {
      this.persistImages();
      return;
    }

    pendingIndexes.forEach((index) => {
      this.imageUploading[index] = true;
    });

    const uploads$ = pendingIndexes.map((index) =>
      this.dataService
        .uploadImage(this.pendingImageFiles[index] as File, this.buildUploadFolder('images'))
        .pipe(
          map((res: any) => ({
            index,
            url: String(res?.url || '').trim(),
          }))
        )
    );

    forkJoin(uploads$).subscribe({
      next: (results) => {
        results.forEach(({ index, url }) => {
          if (url) {
            this.editableImages[index] = url;
            this.imagePreviewUrls[index] = url;
          }
        });
        this.persistImages();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Image upload failed', 'Error');
        pendingIndexes.forEach((index) => {
          this.imageUploading[index] = false;
        });
      },
    });
  }

  /**
   * onGuideImageSelected function.
   * @param {Event} event - File input event.
   * @param {number} index - Image slot index.
   * @returns {void} Result.
   */
  onGuideImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      this.toastr.error('Max image size allowed is 1 MB', 'Error');
      input.value = '';
      return;
    }

    this.revokePreviewUrl(this.imagePreviewUrls[index]);
    this.pendingImageFiles[index] = file;
    this.imagePreviewUrls[index] = URL.createObjectURL(file);
    input.value = '';
  }

  /**
   * onGuideDocSelected function.
   * @param {Event} event - File input event.
   * @param {number} index - Doc slot index.
   * @returns {void} Result.
   */
  onGuideDocSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.toastr.error('Only PDF file is allowed', 'Error');
      input.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      this.toastr.error('Max PDF size allowed is 1 MB', 'Error');
      input.value = '';
      return;
    }

    this.revokePreviewUrl(this.docPreviewUrls[index]);
    this.pendingDocFiles[index] = file;
    this.docPreviewUrls[index] = URL.createObjectURL(file);
    input.value = '';
  }

  /**
   * saveCategoryName function.
   * @returns {void} Result.
   */
  saveCategoryName(): void {
    if (!this.canEditCategory) return;
    if (!this.selectedRow || !this.editableCategoryName.trim()) {
      return;
    }

    this.dataService
      .updateWebsiteGuideCategory(this.selectedRow.uuid, { name: this.editableCategoryName.trim() })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Category name updated', 'Success');
          this.hideModal(this.modalIds.edit);
          this.loadRows();
        },
        error: (err: any) => {
          this.toastr.error(err?.error?.message || 'Unable to update category name', 'Error');
        },
      });
  }

  /**
   * saveNewCategory function.
   * @returns {void} Result.
   */
  saveNewCategory(): void {
    if (!this.canOpenAdd) return;
    const trimmedName = this.newCategoryName.trim();
    if (!trimmedName || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.dataService
      .createWebsiteGuideCategory({
        guideType: this.guideType,
        audience: this.activeSubTab.toUpperCase(),
        name: trimmedName,
        parentUuid: this.currentParentUuid || undefined,
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Category created', 'Success');
          this.hideModal(this.modalIds.add);
          this.loadRows();
        },
        error: (err: any) => {
          this.toastr.error(err?.error?.message || 'Unable to create category', 'Error');
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }

  /**
   * exportGuideData function.
   * @returns {void} Result.
   */
  exportGuideData(): void {
    this.hideModal(this.modalIds.export);
  }

  /**
   * closeModal function.
   * @param {'video' | 'youtube' | 'info' | 'doc' | 'image' | 'edit' | 'add' | 'export' | 'removeMedia'} modalId - Modal key to close.
   * @returns {void} Result.
   */
  closeModal(modalId: keyof typeof this.modalIds): void {
    if (modalId === 'youtube') {
      this.activeVideoUrl = null;
    }
    if (modalId === 'image') {
      this.clearImagePreviewUrls();
      this.pendingImageFiles = [null, null, null, null];
      this.imageUploading = [false, false, false, false];
    }
    if (modalId === 'doc') {
      this.clearDocPreviewUrls();
      this.pendingDocFiles = [null, null, null, null];
      this.docUploading = [false, false, false, false];
    }
    if (modalId === 'removeMedia') {
      this.pendingMediaRemoval = null;
    }
    this.hideModal(this.modalIds[modalId]);
  }

  /**
   * buildUploadFolder function.
   * @param {'images' | 'docs'} type - Folder type.
   * @returns {string} Result.
   */
  private buildUploadFolder(type: 'images' | 'docs'): string {
    const slug = this.guideType === 'DEVELOPER_GUIDE' ? 'developer-guide' : 'website-guide';
    return `${slug}/${this.activeSubTab}/${type}`;
  }

  /**
   * showBootstrapModal function.
   * @param {string} modalId - DOM id of modal.
   * @returns {void} Result.
   */
  private showBootstrapModal(modalId: string): void {
    const element = document.getElementById(modalId);
    if (!element) return;
    const modal = new bootstrap.Modal(element);
    modal.show();
  }

  /**
   * showModal function.
   * @param {string} modalId - DOM id of modal.
   * @returns {void} Result.
   */
  private showModal(modalId: string): void {
    const element = document.getElementById(modalId);
    if (!element) return;
    const modal = new bootstrap.Modal(element);
    modal.show();
  }

  /**
   * hideModal function.
   * @param {string} modalId - DOM id of modal.
   * @returns {void} Result.
   */
  private hideModal(modalId: string): void {
    const element = document.getElementById(modalId);
    if (!element) return;
    const modal = bootstrap.Modal.getOrCreateInstance(element);
    modal.hide();
  }

  /**
   * persistImages function.
   * @returns {void} Result.
   */
  private persistImages(): void {
    if (!this.selectedRow) return;

    const payload = {
      images: this.editableImages
        .map((pathname) => String(pathname || '').trim())
        .filter((pathname) => pathname)
        .map((pathname) => ({ pathname })),
    };

    this.dataService.updateWebsiteGuideCategory(this.selectedRow.uuid, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Images updated', 'Success');
        this.hideModal(this.modalIds.image);
        this.clearImagePreviewUrls();
        this.pendingImageFiles = [null, null, null, null];
        this.imageUploading = [false, false, false, false];
        this.loadRows();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update images', 'Error');
      },
      complete: () => {
        this.imageUploading = [false, false, false, false];
      },
    });
  }

  /**
   * clearImagePreviewUrls function.
   * @returns {void} Result.
   */
  private clearImagePreviewUrls(): void {
    this.imagePreviewUrls.forEach((url) => this.revokePreviewUrl(url));
    this.imagePreviewUrls = ['', '', '', ''];
  }

  /**
   * persistDocs function.
   * @returns {void} Result.
   */
  private persistDocs(): void {
    if (!this.selectedRow) return;

    const payload = {
      docs: this.editableDocs
        .map((pathname) => this.normalizeDocPathForPayload(pathname))
        .filter((pathname) => pathname)
        .map((pathname) => ({ pathname })),
    };

    this.dataService.updateWebsiteGuideCategory(this.selectedRow.uuid, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Docs updated', 'Success');
        this.hideModal(this.modalIds.doc);
        this.clearDocPreviewUrls();
        this.pendingDocFiles = [null, null, null, null];
        this.docUploading = [false, false, false, false];
        this.loadRows();
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Unable to update docs', 'Error');
      },
      complete: () => {
        this.docUploading = [false, false, false, false];
      },
    });
  }

  /**
   * clearDocPreviewUrls function.
   * @returns {void} Result.
   */
  private clearDocPreviewUrls(): void {
    this.docPreviewUrls.forEach((url) => this.revokePreviewUrl(url));
    this.docPreviewUrls = ['', '', '', ''];
  }

  /**
   * revokePreviewUrl function.
   * @param {string} url - Browser object URL.
   * @returns {void} Result.
   */
  private revokePreviewUrl(url: string): void {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * normalizeDocPathForPayload function.
   * @param {string} value - Raw doc value.
   * @returns {string} Result.
   */
  private normalizeDocPathForPayload(value: string): string {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.startsWith('/api/')) {
      return this.extractDocPathFromUrl(raw);
    }
    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }
    if (raw.startsWith('/')) {
      return raw;
    }
    return `/${raw}`;
  }

  /**
   * extractDocPathFromUrl function.
   * @param {string} value - Raw API URL or path.
   * @returns {string} Result.
   */
  private extractDocPathFromUrl(value: string): string {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const marker = '/api/v1/upload/doc/';
    const markerIndex = raw.indexOf(marker);
    if (markerIndex >= 0) {
      const relative = raw.slice(markerIndex + marker.length).replace(/^\/+/, '');
      return relative ? `/${relative}` : '';
    }
    return raw.startsWith('/') ? raw : '';
  }
}
