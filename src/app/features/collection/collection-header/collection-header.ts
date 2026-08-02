import { Component, inject } from '@angular/core';

import { CollectionStore } from '@core/state/collection.store';
import { ProductCategory } from '@core/models/product';

interface Tab {
  label: string;
  value: ProductCategory | 'All';
}

@Component({
  selector: 'app-collection-header',
  templateUrl: './collection-header.html',
  styleUrl: './collection-header.scss',
})
export class CollectionHeader {
  protected readonly store = inject(CollectionStore);

  protected readonly tabs: Tab[] = [
    { label: 'Shirts', value: 'Shirts' },
    { label: 'T-Shirts', value: 'T-Shirts' },
    { label: 'Bottoms', value: 'Bottoms' },
    { label: 'View All', value: 'All' },
  ];

  select(tab: Tab): void {
    this.store.setCategory(tab.value);
  }
}
