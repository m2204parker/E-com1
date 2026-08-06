import { Component, ElementRef, NgZone, OnInit, ViewChild, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import gsap from 'gsap';

import { SmoothScrollService } from '@core/services/smooth-scroll.service';
import { AnnouncementBar } from '@features/shell/announcement-bar/announcement-bar';
import { SiteFooter } from '@features/shell/footer/footer';
import { SiteHeader } from '@features/shell/header/header';
import { Intro } from '@shared/intro/intro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AnnouncementBar, SiteHeader, SiteFooter, Intro],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  @ViewChild('shell', { static: true }) shellRef!: ElementRef<HTMLElement>;

  protected readonly introDone = signal(false);

  constructor(
    private readonly smoothScroll: SmoothScrollService,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  onIntroDone(): void {
    this.introDone.set(true);
    document.body.style.overflow = '';
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
