import { Component, OnInit, computed, inject, input, signal } from '@angular/core';

import { FacetGroup, FacetGroupId } from '@core/models/product';
import { CollectionStore } from '@core/state/collection.store';
import { Icon } from '@shared/icon/icon';

const VISIBLE_LIMIT = 10;

@Component({
  selector: 'app-filter-group',
  imports: [Icon],
  templateUrl: './filter-group.html',
  styleUrl: './filter-group.scss',
})
export class FilterGroup implements OnInit {
  readonly group = input.required<FacetGroup>();
  readonly defaultOpen = input<boolean>(false);

  private readonly store = inject(CollectionStore);

  protected readonly expanded = signal(false);
  protected readonly showAll = signal(false);

  protected readonly visibleOptions = computed(() =>
    this.showAll() ? this.group().options : this.group().options.slice(0, VISIBLE_LIMIT)
  );

  protected readonly hiddenCount = computed(
    () => Math.max(0, this.group().options.length - VISIBLE_LIMIT)
  );

  protected readonly selectedCount = computed(
    () => this.store.selectedFilters()[this.group().id]?.length ?? 0
  );

  ngOnInit(): void {
    this.expanded.set(this.defaultOpen());
  }

  isSelected(value: string): boolean {
    return this.store.selectedFilters()[this.group().id]?.includes(value) ?? false;
  }

  toggle(value: string): void {
    this.store.toggleFacet(this.group().id as FacetGroupId, value);
  }

  clearGroup(): void {
    this.store.clearFacet(this.group().id as FacetGroupId);
  }
}
