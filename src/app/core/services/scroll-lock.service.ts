import { Injectable } from '@angular/core';

/**
 * Reference-counted body scroll lock. Multiple things can want the page
 * scroll locked at once (the intro splash, a cart/wishlist/profile
 * drawer) — a naive `overflow = 'hidden' | ''` toggle in each of them
 * would fight over `document.body.style.overflow` and unlock too early.
 */
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private count = 0;

  lock(): void {
    this.count++;
    if (this.count === 1) {
      document.body.style.overflow = 'hidden';
    }
  }

  unlock(): void {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) {
      document.body.style.overflow = '';
    }
  }
}
