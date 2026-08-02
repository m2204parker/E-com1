import { Component, input } from '@angular/core';

export type IconName =
  | 'search'
  | 'cart'
  | 'heart'
  | 'heart-filled'
  | 'user'
  | 'menu'
  | 'close'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'filter'
  | 'star'
  | 'plus'
  | 'check'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'clock'
  | 'arrow-right'
  | 'facebook'
  | 'instagram'
  | 'youtube';

/**
 * Inline SVG icon set. Rendered as inline SVG (no font files, no extra HTTP
 * requests) which keeps the critical path lean.
 */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(1.7);
}
