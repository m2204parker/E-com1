import { Component, computed, inject, signal } from '@angular/core';

import { SortKey } from '@core/models/product';
import { CollectionStore } from '@core/state/collection.store';
import { Icon } from '@shared/icon/icon';

interface SortOption {
  key: SortKey;
  label: string;
}

@Component({
  selector: 'app-sort-bar',
  imports: [Icon],
  templateUrl: './sort-bar.html',
  styleUrl: './sort-bar.scss',
})
export class SortBar {
  protected readonly store = inject(CollectionStore);

  protected readonly open = signal(false);

  protected readonly options: SortOption[] = [
    { key: 'featured', label: 'Featured' },
    { key: 'best-selling', label: 'Best selling' },
    { key: 'title-asc', label: 'Alphabetically, A-Z' },
    { key: 'title-desc', label: 'Alphabetically, Z-A' },
    { key: 'price-asc', label: 'Price, low to high' },
    { key: 'price-desc', label: 'Price, high to low' },
    { key: 'date-old', label: 'Date, old to new' },
    { key: 'date-new', label: 'Date, new to old' },
  ];

  protected readonly currentLabel = computed(
    () => this.options.find((o) => o.key === this.store.sortBy())?.label ?? 'Featured'
  );

  select(key: SortKey): void {
    this.store.setSortBy(key);
    this.open.set(false);
  }
}
