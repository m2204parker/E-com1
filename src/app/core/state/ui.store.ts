import { Injectable, signal } from '@angular/core';

export type PanelId = 'cart' | 'wishlist' | 'profile' | null;

/** Tracks which slide-over panel (cart, wishlist, profile) is currently open. */
@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly activePanel = signal<PanelId>(null);

  open(panel: PanelId): void {
    this.activePanel.set(panel);
  }

  close(): void {
    this.activePanel.set(null);
  }

  isOpen(panel: PanelId): boolean {
    return this.activePanel() === panel;
  }
}
