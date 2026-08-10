import { Component, ElementRef, NgZone, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import gsap from 'gsap';

import { ScrollLockService } from '@core/services/scroll-lock.service';
import { SmoothScrollService } from '@core/services/smooth-scroll.service';
import { AnnouncementBar } from '@features/shell/announcement-bar/announcement-bar';
import { CartDrawer } from '@features/shell/cart-drawer/cart-drawer';
import { SiteFooter } from '@features/shell/footer/footer';
import { SiteHeader } from '@features/shell/header/header';
import { ProfileDrawer } from '@features/shell/profile-drawer/profile-drawer';
import { WishlistDrawer } from '@features/shell/wishlist-drawer/wishlist-drawer';
import { Intro } from '@shared/Intro/intro';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AnnouncementBar,
    SiteHeader,
    SiteFooter,
    Intro,
    CartDrawer,
    WishlistDrawer,
    ProfileDrawer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  @ViewChild('shell', { static: true }) shellRef!: ElementRef<HTMLElement>;

  protected readonly introDone = signal(false);

  private readonly scrollLock = inject(ScrollLockService);

  constructor(
    private readonly smoothScroll: SmoothScrollService,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.scrollLock.lock();
  }

  onIntroDone(): void {
    this.introDone.set(true);
    this.scrollLock.unlock();
    this.smoothScroll.init();

    this.zone.runOutsideAngular(() => {
      gsap.fromTo(
        this.shellRef.nativeElement,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      );
    });
  }
}
