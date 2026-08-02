import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take, timer } from 'rxjs';

import {
  CollectionFilters,
  FacetGroup,
  FacetGroupId,
  FACET_GROUP_IDS,
  FACET_GROUP_LABELS,
  Product,
  ProductCategory,
  SortKey,
} from '../models/product';
import { ProductService } from '../services/product.service';

export type CategoryFilter = ProductCategory | 'All';

interface PriceRange {
  min: number | null;
  max: number | null;
}

const FIELD_GROUPS: Record<Exclude<FacetGroupId, 'color' | 'size'>, keyof Product> = {
  sleeves: 'sleeves',
  pattern: 'pattern',
  fit: 'fit',
  collar: 'collar',
  material: 'material',
};

function productFacetValues(product: Product, groupId: FacetGroupId): string[] {
  if (groupId === 'color') return [product.color];
  if (groupId === 'size') return product.variants.map((v) => v.size);
  const field = FIELD_GROUPS[groupId as Exclude<FacetGroupId, 'color' | 'size'>];
  const value = product[field] as string | undefined;
  return value ? [value] : [];
}

function buildFacetGroups(products: Product[]): FacetGroup[] {
  return FACET_GROUP_IDS.map((groupId) => {
    const counts = new Map<string, number>();
    for (const product of products) {
      for (const value of productFacetValues(product, groupId)) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    const options = [...counts.entries()]
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    return { id: groupId, label: FACET_GROUP_LABELS[groupId], options };
  });
}

function matchesFacets(product: Product, filters: CollectionFilters): boolean {
  return Object.entries(filters).every(([groupId, selected]) => {
    if (!selected.length) return true;
    const values = productFacetValues(product, groupId as FacetGroupId);
    return selected.some((s) => values.includes(s));
  });
}

/**
 * CollectionStore is the single source of truth for the collection page.
 *
 * Design:
 *  - State lives in writable `signal`s; every derived view (filtered list,
 *    sort, pagination, facet counts) is a pure `computed` chain.
 *  - Only one place writes state (the action methods below), which keeps
 *    mutation traceable and makes the store trivial to unit-test.
 *  - RxJS is used for async boundaries (initial load, simulated load-more);
 *    every subscription is auto-torn-down on destruction.
 */
@Injectable({ providedIn: 'root' })
export class CollectionStore {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  // --- Writable state ---
  private readonly productsSignal = signal<Product[]>([]);
  private readonly filtersSignal = signal<CollectionFilters>({});
  private readonly categorySignal = signal<CategoryFilter>('All');
  private readonly sortSignal = signal<SortKey>('featured');
  private readonly priceSignal = signal<PriceRange>({ min: null, max: null });
  private readonly searchSignal = signal('');
  private readonly pageSignal = signal(1);

  readonly pageSize = 12;

  // --- Loading / UI flags ---
  readonly isInitialLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly isMobileFiltersOpen = signal(false);

  // --- Public readonly views ---
  readonly selectedFilters = this.filtersSignal.asReadonly();
  readonly category = this.categorySignal.asReadonly();
  readonly sortBy = this.sortSignal.asReadonly();
  readonly priceRange = this.priceSignal.asReadonly();
  readonly search = this.searchSignal.asReadonly();

  /** Facet groups with live counts, computed from the loaded catalog. */
  readonly facetGroups = computed<FacetGroup[]>(() => buildFacetGroups(this.productsSignal()));

  /** Products after category + facet + price + search filtering. */
  readonly filteredProducts = computed<Product[]>(() => {
    const products = this.productsSignal();
    const category = this.categorySignal();
    const filters = this.filtersSignal();
    const { min, max } = this.priceSignal();
    const q = this.searchSignal().trim().toLowerCase();

    return products.filter((product) => {
      if (category !== 'All' && product.category !== category) return false;
      if (!matchesFacets(product, filters)) return false;
      if (min !== null && product.price.current < min) return false;
      if (max !== null && product.price.current > max) return false;
      if (q && !product.title.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  /** Filtered products after sort application. */
  readonly sortedProducts = computed<Product[]>(() => {
    const products = this.filteredProducts();
    const sort = this.sortSignal();

    if (sort === 'featured') return [...products];
    if (sort === 'title-asc' || sort === 'title-desc') {
      return [...products].sort((a, b) => {
        const cmp = a.title.localeCompare(b.title);
        return sort === 'title-asc' ? cmp : -cmp;
      });
    }
    if (sort === 'price-asc' || sort === 'price-desc') {
      return [...products].sort((a, b) => {
        const cmp = a.price.current - b.price.current;
        return sort === 'price-asc' ? cmp : -cmp;
      });
    }
    if (sort === 'date-new' || sort === 'date-old') {
      return [...products].sort((a, b) => {
        const cmp = a.publishedAt - b.publishedAt;
        return sort === 'date-new' ? -cmp : cmp;
      });
    }
    if (sort === 'best-selling') {
      return [...products].sort((a, b) => b.rating.count - a.rating.count);
    }
    return [...products];
  });

  /** The slice currently visible on screen (pagination). */
  readonly pagedProducts = computed<Product[]>(() => {
    const page = this.pageSignal();
    return this.sortedProducts().slice(0, page * this.pageSize);
  });

  readonly totalCount = computed<number>(() => this.sortedProducts().length);
  readonly allCount = computed<number>(() => this.productsSignal().length);
  readonly hasMore = computed<boolean>(
    () => this.pagedProducts().length < this.totalCount()
  );

  readonly activeFacetCount = computed<number>(() =>
    Object.values(this.filtersSignal()).reduce((sum, values) => sum + values.length, 0)
  );

  /** Selected facet values rendered as removable chips. */
  readonly activeChips = computed<{ group: FacetGroupId; value: string; label: string }[]>(() =>
    Object.entries(this.filtersSignal()).flatMap(([groupId, values]) =>
      values.map((value) => ({
        group: groupId as FacetGroupId,
        value,
        label: value,
      }))
    )
  );

  // -------------------------------------------------------------------------
  // Async: initial catalog load (RxJS boundary)
  // -------------------------------------------------------------------------
  load(): void {
    if (this.productsSignal().length || this.isInitialLoading()) return;

    this.isInitialLoading.set(true);
    this.loadError.set(null);

    this.productService.getProducts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (products) => this.productsSignal.set(products),
      error: () => {
        this.isInitialLoading.set(false);
        this.loadError.set('We couldn\u2019t load the collection. Please try again.');
      },
      complete: () => this.isInitialLoading.set(false),
    });
  }

  /** Load the next page (simulated network latency). */
  loadMore(): void {
    if (!this.hasMore() || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);
    timer(500)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pageSignal.update((page) => page + 1);
        this.isLoadingMore.set(false);
      });
  }

  // -------------------------------------------------------------------------
  // Sync actions
  // -------------------------------------------------------------------------
  setCategory(category: CategoryFilter): void {
    this.categorySignal.set(category);
    this.pageSignal.set(1);
  }

  setSortBy(sort: SortKey): void {
    this.sortSignal.set(sort);
  }

  setPriceRange(min: number | null, max: number | null): void {
    this.priceSignal.set({ min, max });
    this.pageSignal.set(1);
  }

  setSearch(query: string): void {
    this.searchSignal.set(query);
    this.pageSignal.set(1);
  }

  toggleFacet(groupId: FacetGroupId, value: string): void {
    this.filtersSignal.update((filters) => {
      const current = [...(filters[groupId] ?? [])];
      const index = current.indexOf(value);
      if (index >= 0) current.splice(index, 1);
      else current.push(value);

      const next = { ...filters };
      if (current.length) next[groupId] = current;
      else delete next[groupId];
      return next;
    });
    this.pageSignal.set(1);
  }

  clearFacet(groupId: FacetGroupId): void {
    this.filtersSignal.update((filters) => {
      const next = { ...filters };
      delete next[groupId];
      return next;
    });
    this.pageSignal.set(1);
  }

  resetFilters(): void {
    this.filtersSignal.set({});
    this.priceSignal.set({ min: null, max: null });
    this.categorySignal.set('All');
    this.searchSignal.set('');
    this.pageSignal.set(1);
  }

  setMobileFiltersOpen(open: boolean): void {
    this.isMobileFiltersOpen.set(open);
  }
}
