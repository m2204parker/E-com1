import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NAV_ITEMS } from '@core/data/navigation';
import { ShoppingStore } from '@core/state/shopping.store';
import { Icon } from '@shared/icon/icon';
import { LazyImage } from '@shared/lazy-image/lazy-image';
import { SearchOverlay } from '../search-overlay/search-overlay';

@Component({
  selector: 'app-site-header',
  imports: [Icon, LazyImage, SearchOverlay, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class SiteHeader {
  protected readonly navItems = NAV_ITEMS;
  protected readonly shopping = inject(ShoppingStore);

  protected readonly activeMega = signal<string | null>(null);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly expandedItem = signal<string | null>(null);

  /** Header slides away on scroll-down, reappears on scroll-up. */
  protected readonly hidden = signal(false);
  /** Picks up a subtle shadow once the page has scrolled past the top. */
  protected readonly scrolled = signal(false);

  private lastScrollY = 0;

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    this.scrolled.set(y > 8);

    const delta = y - this.lastScrollY;
    if (y > 140 && delta > 4 && !this.mobileMenuOpen() && !this.activeMega()) {
      this.hidden.set(true);
    } else if (delta < -4 || y < 140) {
      this.hidden.set(false);
    }
    this.lastScrollY = y;
  }

  onNavEnter(label: string): void {
    this.activeMega.set(label);
  }

  onNavLeave(): void {
    this.activeMega.set(null);
  }

  toggleMobileItem(label: string): void {
    this.expandedItem.update((current) => (current === label ? null : label));
  }

  closeMobile(): void {
    this.mobileMenuOpen.set(false);
    this.expandedItem.set(null);
  }
}
