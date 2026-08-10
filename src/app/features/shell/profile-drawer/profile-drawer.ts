import { Component, inject } from '@angular/core';

import { UiStore } from '@core/state/ui.store';
import { Icon, IconName } from '@shared/icon/icon';
import { DrawerPanel } from '@shared/drawer-panel/drawer-panel';

interface ProfileLink {
  label: string;
  icon: IconName;
  panel?: 'wishlist' | 'cart';
}

@Component({
  selector: 'app-profile-drawer',
  imports: [DrawerPanel, Icon],
  templateUrl: './profile-drawer.html',
  styleUrl: './profile-drawer.scss',
})
export class ProfileDrawer {
  protected readonly ui = inject(UiStore);

  protected readonly links: ProfileLink[] = [
    { label: 'My Orders', icon: 'clock' },
    { label: 'Wishlist', icon: 'heart', panel: 'wishlist' },
    { label: 'Saved Addresses', icon: 'pin' },
    { label: 'Track Order', icon: 'check' },
    { label: 'Help & Support', icon: 'phone' },
  ];

  onLinkClick(link: ProfileLink): void {
    if (link.panel) {
      this.ui.open(link.panel);
    }
  }
}
