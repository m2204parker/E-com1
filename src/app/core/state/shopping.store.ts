import { Injectable, computed, signal } from '@angular/core';

export interface CartLine {
  productId: string;
  title: string;
  size: string;
  price: number;
}

/**
 * Lightweight shopping state shared by the header and product cards.
 * Kept deliberately simple; swap internals for an ngrx signal store or a
 * backend cart API without touching the components.
 */
@Injectable({ providedIn: 'root' })
export class ShoppingStore {
  readonly wishlist = signal<Set<string>>(new Set());
  readonly lines = signal<CartLine[]>([]);

  readonly wishlistCount = computed(() => this.wishlist().size);
  readonly cartCount = computed(() => this.lines().length);

  isWishlisted(productId: string): boolean {
    return this.wishlist().has(productId);
  }

  toggleWishlist(productId: string): void {
    this.wishlist.update((set) => {
      const next = new Set(set);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  addToCart(line: CartLine): void {
    this.lines.update((lines) => [...lines, line]);
  }
}
