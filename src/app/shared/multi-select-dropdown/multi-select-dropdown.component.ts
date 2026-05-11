
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrl: './multi-select-dropdown.component.scss'
})
export class MultiSelectDropdownComponent {
  @Input() items: any[] = []; // List of all items
  @Input() selectedItems: string[] = []; // Selected item IDs
  @Input() displayField: string = 'name'; // Display label field
  @Input() valueField: string = 'id'; // Unique ID field
  @Input() placeholderText: string = 'Select Users';

  @Output() selectedItemsChange = new EventEmitter<string[]>();
  @Output() loadMore = new EventEmitter<void>();

  dropdownOpen: boolean = false;
  searchTerm: string = '';

  // 🔥 Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  /**
   * onClickOutside function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.dropdownOpen = false;
    }
  }

  @HostListener('document:closeAllDropdowns')
  /**
   * handleCloseAll function.
   * @returns {*} Result.
   */
  handleCloseAll(): void {
    this.dropdownOpen = false;
  }

  // ✅ Toggle dropdown open/close
  /**
   * toggleDropdown function.
   * @returns {*} Result.
   */
  toggleDropdown(): void {
    if (!this.dropdownOpen) {
      document.dispatchEvent(new CustomEvent('closeAllDropdowns'));
    }
    this.dropdownOpen = !this.dropdownOpen;
  }

  // ✅ Select or unselect an item
  /**
   * toggleSelection function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  toggleSelection(item: any): void {
    const value = item?.[this.valueField];
    if (!value) return;

    if (this.selectedItems.includes(value)) {
      this.selectedItems = this.selectedItems.filter(i => i !== value);
    } else {
      this.selectedItems = [...this.selectedItems, value];
    }

    this.selectedItemsChange.emit(this.selectedItems);
  }

  // ✅ Check if an item is selected
  /**
   * isSelected function.
   * @param {*} item - Parameter.
   * @returns {*} Result.
   */
  isSelected(item: any): boolean {
    return this.selectedItems.includes(item?.[this.valueField]);
  }

  // ✅ Get display value from selected ID
  /**
   * getDisplayValue function.
   * @param {*} id - Parameter.
   * @returns {*} Result.
   */
  getDisplayValue(id: string | undefined): string {
    if (!id) return 'Unknown';
    const foundItem = this.items.find(item => item?.[this.valueField] === id);
    return foundItem ? foundItem[this.displayField] : 'Unknown';
  }

  // ✅ Check if all items are selected
  /**
   * isAllSelected function.
   * @returns {*} Result.
   */
  isAllSelected(): boolean {
    return (
      this.items.length > 0 &&
      this.items.every(item => this.selectedItems.includes(item?.[this.valueField]))
    );
  }

  // ✅ Select or deselect all
  /**
   * toggleSelectAll function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  toggleSelectAll(event: Event): void {
    /**
     * isChecked function.
     * @returns {*} Result.
     */
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedItems = this.items
        .map(item => String(item?.[this.valueField]))
        .filter((val): val is string => !!val);
    } else {
      this.selectedItems = [];
    }
    this.selectedItemsChange.emit(this.selectedItems);
  }

  // ✅ Infinite scroll (load more)
  /**
   * onScroll function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = 100;
    const position = target.scrollTop + target.clientHeight;
    const height = target.scrollHeight;

    if (position + threshold >= height) {
      this.loadMore.emit();
    }
  }

  // ✅ Filtered list based on search term
  get filteredItems(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.items;
    return this.items.filter(item =>
      item?.[this.displayField]?.toLowerCase().includes(term)
    );
  }
}