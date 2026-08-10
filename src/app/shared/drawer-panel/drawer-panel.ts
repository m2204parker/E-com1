import { Component, HostListener, effect, inject, input, output } from '@angular/core';

import { ScrollLockService } from '@core/services/scroll-lock.service';
import { Icon } from '@shared/icon/icon';

/**
 * Reusable slide-over panel used by the cart, wishlist, and profile
 * drawers. Always mounted so CSS transitions animate both the open AND
 * the close, unlike `@if` which would rip the panel out instantly.
 */
@Component({
  selector: 'app-drawer-panel',
  imports: [Icon],
  templateUrl: './drawer-panel.html',
  styleUrl: './drawer-panel.scss',
})
export class DrawerPanel {
  readonly open = input.required<boolean>();
  readonly label = input('Panel');
  readonly showFooter = input(true);
  readonly closed = output<void>();

  private readonly scrollLock = inject(ScrollLockService);
  private wasOpen = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (isOpen && !this.wasOpen) this.scrollLock.lock();
      if (!isOpen && this.wasOpen) this.scrollLock.unlock();
      this.wasOpen = isOpen;
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.closed.emit();
  }

  onBackdropClick(): void {
    this.closed.emit();
  }
}
