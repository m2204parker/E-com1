import { Component, inject, signal } from '@angular/core';
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
