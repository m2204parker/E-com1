import { Component, computed, inject, signal } from '@angular/core';

import { CollectionStore } from '@core/state/collection.store';
import { FilterGroup } from '../filter-group/filter-group';

@Component({
  selector: 'app-filter-sidebar',
  imports: [FilterGroup],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss',
})
export class FilterSidebar {
  protected readonly store = inject(CollectionStore);

  protected readonly from = signal<number | null>(null);
  protected readonly to = signal<number | null>(null);

  protected readonly hasActiveFilters = computed(
    () =>
      this.store.activeFacetCount() > 0 ||
      this.store.priceRange().min !== null ||
      this.store.priceRange().max !== null
  );

  parseInput(event: Event): number | null {
    const value = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  applyPrice(): void {
    this.store.setPriceRange(this.from(), this.to());
  }

  resetAll(): void {
    this.store.resetFilters();
    this.from.set(null);
    this.to.set(null);
  }

  defaultOpen(groupId: string): boolean {
    return groupId === 'color' || groupId === 'size';
  }
}
