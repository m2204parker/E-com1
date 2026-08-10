import { Component, computed, inject, input, signal } from '@angular/core';

import { Product } from '@core/models/product';
import { ShoppingStore } from '@core/state/shopping.store';
import { UiStore } from '@core/state/ui.store';
import { discountPercent, formatPrice } from '@core/utils/format';
import { Icon } from '@shared/icon/icon';
import { LazyImage } from '@shared/lazy-image/lazy-image';

@Component({
  selector: 'app-product-card',
  imports: [Icon, LazyImage],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  /** Above-the-fold cards load immediately with high priority. */
  readonly eager = input<boolean>(false);

  protected readonly shopping = inject(ShoppingStore);
  protected readonly ui = inject(UiStore);
  protected readonly added = signal(false);
  protected readonly formatPrice = formatPrice;
  protected readonly isWishlisted = () =>
    this.shopping.isWishlisted(this.product().id);

  /** Compare-at price formatted for the strikethrough; null when none. */
  compareAtLabel(product: Product): string | null {
    return product.price.compareAt !== null ? formatPrice(product.price.compareAt) : null;
  }

  protected readonly discount = computed(() => {
    const { current, compareAt } = this.product().price;
    return compareAt ? discountPercent(current, compareAt) : 0;
  });

  toggleWishlist(): void {
    const product = this.product();
    this.shopping.toggleWishlist({
      productId: product.id,
      title: product.title,
      price: product.price.current,
      image: product.images[0]?.src ?? '',
      handle: product.handle,
    });
  }

  addToCart(): void {
    const product = this.product();
    const variant = product.variants.find((v) => v.available) ?? product.variants[0];
    if (!variant) return;

    this.shopping.addToCart({
      productId: product.id,
      title: product.title,
      size: variant.size,
      price: product.price.current,
      image: product.images[0]?.src ?? '',
      handle: product.handle,
    });

    this.added.set(true);
    this.ui.open('cart');
    setTimeout(() => this.added.set(false), 1400);
  }
}
