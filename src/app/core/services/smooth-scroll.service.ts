import { Injectable, NgZone, OnDestroy } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps Lenis smooth-scroll and keeps it in lockstep with GSAP's ticker so
 * ScrollTrigger-driven animations stay perfectly in sync with the eased
 * scroll position (instead of the raw, jumpy native scroll).
 */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private lenis: Lenis | null = null;
  private rafCallback = (time: number) => this.lenis?.raf(time * 1000);

  constructor(private readonly zone: NgZone) {}

  init(): void {
    if (this.lenis || typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(this.rafCallback);
      gsap.ticker.lagSmoothing(0);
    });
  }

  /** Programmatically scroll to a target (element, selector, or offset). */
  scrollTo(target: string | number | HTMLElement, options?: Record<string, unknown>): void {
    this.lenis?.scrollTo(target, options);
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  ngOnDestroy(): void {
    gsap.ticker.remove(this.rafCallback);
    this.lenis?.destroy();
    this.lenis = null;
  }
}
