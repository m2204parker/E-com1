import { Injectable } from '@angular/core';
import { Observable, delay, map, of, shareReplay } from 'rxjs';

import { PRODUCTS } from '../data/products';
import { Product } from '../models/product';

/**
 * ProductService is the only entry point for catalog reads.
 *
 * It mimics a network-backed repository: callers observe a cold Observable
 * that resolves asynchronously (latency) and is then shared so every consumer
 * (grid, filters, facets, search) sees the same snapshot without re-fetching.
 *
 * Swapping this for a real HTTP/GraphQL backend only changes this file — the
 * rest of the app stays untouched.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly catalog$: Observable<Product[]>;

  constructor() {
    this.catalog$ = of(PRODUCTS).pipe(
      delay(650),
      shareReplay({ refCount: false, bufferSize: 1 })
    );
  }

  /** Observable of the full, immutable catalog snapshot. */
  getProducts(): Observable<Product[]> {
    return this.catalog$;
  }

  /** Resolve a single product by handle; null when not found. */
  getByHandle(handle: string): Observable<Product | null> {
    return this.catalog$.pipe(
      map((products) => products.find((p) => p.handle === handle) ?? null)
    );
  }

  /**
   * Case-insensitive full-text search across the catalog.
   * Callers are expected to debounce before subscribing.
   */
  search(query: string): Observable<Product[]> {
    const q = query.trim().toLowerCase();
    return this.catalog$.pipe(
      map((products) =>
        q
          ? products.filter(
              (p) =>
                p.title.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.color.toLowerCase().includes(q)
            )
          : products
      )
    );
  }
}
