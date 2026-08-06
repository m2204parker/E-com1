import { Component, inject } from '@angular/core';

import { CollectionStore } from '@core/state/collection.store';
import { Icon } from '@shared/icon/icon';
import { ScrollReveal } from '@shared/scroll-reveal/scroll-reveal.directive';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  imports: [Icon, ProductCard, ScrollReveal],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  protected readonly store = inject(CollectionStore);
  protected readonly skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8];

  /** First row loads eagerly (fetchpriority=high), the rest lazy. */
  isEager(index: number): boolean {
    return index < 4;
  }
}
