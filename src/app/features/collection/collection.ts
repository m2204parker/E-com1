import { Component, inject } from '@angular/core';

import { CollectionStore } from '@core/state/collection.store';
import { Icon } from '@shared/icon/icon';
import { Breadcrumb } from './breadcrumb/breadcrumb';
import { CollectionHeader } from './collection-header/collection-header';
import { FilterSidebar } from './filter-sidebar/filter-sidebar';
import { ProductGrid } from './product-grid/product-grid';
import { SortBar } from './sort-bar/sort-bar';

@Component({
  selector: 'app-collection',
  imports: [
    Icon,
    Breadcrumb,
    CollectionHeader,
    FilterSidebar,
    SortBar,
    ProductGrid,
  ],
  templateUrl: './collection.html',
  styleUrl: './collection.scss',
})
export class Collection {
  protected readonly store = inject(CollectionStore);

  constructor() {
    this.store.load();
  }
}
