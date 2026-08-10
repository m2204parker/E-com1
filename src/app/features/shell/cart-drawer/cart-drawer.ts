import { Component, inject } from '@angular/core';

import { ShoppingStore } from '@core/state/shopping.store';
import { UiStore } from '@core/state/ui.store';
import { formatPrice } from '@core/utils/format';
import { Icon } from '@shared/icon/icon';
import { LazyImage } from '@shared/lazy-image/lazy-image';
import { DrawerPanel } from '@shared/drawer-panel/drawer-panel';

@Component({
  selector: 'app-cart-drawer',
  imports: [DrawerPanel, Icon, LazyImage],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawer {
  protected readonly shopping = inject(ShoppingStore);
  protected readonly ui = inject(UiStore);
  protected readonly formatPrice = formatPrice;
}
