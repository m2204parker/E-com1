import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { Icon } from '@shared/icon/icon';
import { LazyImage } from '@shared/lazy-image/lazy-image';
import { Product } from '@core/models/product';
import { ProductService } from '@core/services/product.service';
import { formatPrice } from '@core/utils/format';

const TOP_SEARCHES = [
  'Linen Shirts',
  'Baggy Fit Jeans',
  'Oversize T-Shirts',
  'Cotton Pants',
  'Track Pants',
  'Embroidered Shirts',
];

@Component({
  selector: 'app-search-overlay',
  templateUrl: './search-overlay.html',
  styleUrl: './search-overlay.scss',
  imports: [Icon, LazyImage],
})
export class SearchOverlay {
  readonly closeEvent = output<void>();

  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  readonly query = signal('');
  readonly results = signal<Product[]>([]);
  readonly isSearching = signal(false);
  protected readonly topSearches = TOP_SEARCHES;
  protected readonly formatPrice = formatPrice;
  protected readonly trending = signal<Product[]>([]);

  constructor() {
    afterNextRender(() => this.input().nativeElement.focus());

    toObservable(this.query)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          this.isSearching.set(true);
          if (!q.trim()) return of([]);
          return this.productService.search(q);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((results) => {
        this.results.set(results);
        this.isSearching.set(false);
      });

    // "Most searched" rail: highest rated products.
    this.productService
      .getProducts()
      .pipe(
        map((products) =>
          products
            .filter((p) => p.rating.average !== null)
            .sort((a, b) => b.rating.count - a.rating.count)
            .slice(0, 4)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((products) => this.trending.set(products));
  }

  setQuery(value: string): void {
    this.query.set(value);
  }
}
