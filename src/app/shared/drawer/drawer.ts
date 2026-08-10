import { Component, input, output } from '@angular/core';

import { Icon } from '@shared/icon/icon';

/**
 * Generic right-hand slide-over shell used by the cart, wishlist, and
 * profile panels. Handles the backdrop, open/close transitions, and the
 * header row; the specific panel supplies its own body via <ng-content>.
 */
@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [Icon],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss',
})
export class Drawer {
  readonly title = input.required<string>();
  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();
}
