import { Injectable, computed, signal } from '@angular/core';

export interface CartLine {
  productId: string;
  title: string;
  size: string;
  price: number;
  image: string;
  handle: string;
  qty: number;
}

export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  handle: string;
}

/**
 * Lightweight shopping state shared by the header, product cards, and the
 * cart/wishlist drawers. Kept deliberately simple; swap internals for an
 * ngrx signal store or a backend cart API without touching the components.
 */
@Injectable({ providedIn: 'root' })
export class ShoppingStore {
  private readonly wishlistMap = signal<Map<string, WishlistItem>>(new Map());
  readonly lines = signal<CartLine[]>([]);

  readonly wishlistItems = computed(() => Array.from(this.wishlistMap().values()));
  readonly wishlistCount = computed(() => this.wishlistMap().size);

  readonly cartCount = computed(() =>
    this.lines().reduce((sum, line) => sum + line.qty, 0),
  );
  readonly cartSubtotal = computed(() =>
    this.lines().reduce((sum, line) => sum + line.price * line.qty, 0),
  );

  isWishlisted(productId: string): boolean {
    return this.wishlistMap().has(productId);
  }

  toggleWishlist(item: WishlistItem): void {
    this.wishlistMap.update((map) => {
      const next = new Map(map);
      if (next.has(item.productId)) next.delete(item.productId);
      else next.set(item.productId, item);
      return next;
    });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistMap.update((map) => {
      const next = new Map(map);
      next.delete(productId);
      return next;
    });
  }

  /** Moves a wishlist item into the cart and drops it from the wishlist. */
  moveToCart(item: WishlistItem, size = 'OneSize'): void {
    this.addToCart({
      productId: item.productId,
      title: item.title,
      price: item.price,
      image: item.image,
      handle: item.handle,
      size,
    });
    this.removeFromWishlist(item.productId);
  }

  addToCart(line: Omit<CartLine, 'qty'>): void {
    this.lines.update((lines) => {
      const existing = lines.find(
        (l) => l.productId === line.productId && l.size === line.size,
      );
      if (existing) {
        return lines.map((l) => (l === existing ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...lines, { ...line, qty: 1 }];
    });
  }

  incrementQty(productId: string, size: string): void {
    this.lines.update((lines) =>
      lines.map((l) =>
        l.productId === productId && l.size === size ? { ...l, qty: l.qty + 1 } : l,
      ),
    );
  }

  decrementQty(productId: string, size: string): void {
    this.lines.update((lines) =>
      lines
        .map((l) =>
          l.productId === productId && l.size === size ? { ...l, qty: l.qty - 1 } : l,
        )
        .filter((l) => l.qty > 0),
    );
  }

  removeFromCart(productId: string, size: string): void {
    this.lines.update((lines) =>
      lines.filter((l) => !(l.productId === productId && l.size === size)),
    );
  }

  clearCart(): void {
    this.lines.set([]);
  }
}
