import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RevealType = 'fade-up' | 'fade' | 'scale' | 'stagger';

/**
 * Drop-in scroll animation directive.
 *
 *   <app-collection-header appReveal></app-collection-header>
 *   <div class="pl-grid" appReveal="stagger" [appRevealChildren]="'.pl-card'"></div>
 *
 * Animates the host (or its matched children, staggered) in from a
 * resting "hidden" state as it enters the viewport. Respects
 * prefers-reduced-motion by skipping straight to the visible state.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class ScrollReveal implements AfterViewInit, OnDestroy {
  /** Animation style. Defaults to 'fade-up'. */
  @Input('appReveal') type: RevealType | '' = 'fade-up';
  /** CSS selector for children to stagger (only used when type = 'stagger'). */
  @Input() appRevealChildren = '';
  /** Delay in seconds before the animation starts. */
  @Input() appRevealDelay = 0;

  private trigger: ScrollTrigger | null = null;
  private tween: gsap.core.Tween | null = null;
  private mutationObserver: MutationObserver | null = null;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    this.zone.runOutsideAngular(() => {
      const build = () => this.animate();
      // product grids etc. render children asynchronously (signals/@for),
      // so re-check once shortly after view init in case targets weren't
      // there yet on the very first frame.
      requestAnimationFrame(() => {
        build();
        if (this.type === 'stagger' && this.appRevealChildren) {
          this.observeForLateChildren();
        }
      });
    });
  }

  private animate(): void {
    const host = this.el.nativeElement;
    const isStagger = this.type === 'stagger' && this.appRevealChildren;
    const targets = isStagger
      ? Array.from(host.querySelectorAll<HTMLElement>(this.appRevealChildren))
      : [host];

    if (!targets.length) return;

    const from = this.fromVars();
    gsap.set(targets, from);

    this.tween?.kill();
    this.trigger?.kill();

    this.tween = gsap.to(targets, {
      ...this.toVars(),
      duration: 0.8,
      delay: this.appRevealDelay,
      ease: 'power3.out',
      stagger: isStagger ? 0.08 : 0,
      scrollTrigger: {
        trigger: host,
        start: 'top 88%',
        once: true,
      },
    });
    this.trigger = this.tween.scrollTrigger ?? null;
  }

  private observeForLateChildren(): void {
    const host = this.el.nativeElement;
    let lastCount = host.querySelectorAll(this.appRevealChildren).length;

    this.mutationObserver = new MutationObserver(() => {
      const count = host.querySelectorAll(this.appRevealChildren).length;
      if (count !== lastCount) {
        lastCount = count;
        this.animate();
      }
    });
    this.mutationObserver.observe(host, { childList: true, subtree: true });
  }

  private fromVars(): gsap.TweenVars {
    switch (this.type) {
      case 'fade':
        return { opacity: 0 };
      case 'scale':
        return { opacity: 0, scale: 0.92 };
      case 'stagger':
      case 'fade-up':
      default:
        return { opacity: 0, y: 32 };
    }
  }

  private toVars(): gsap.TweenVars {
    switch (this.type) {
      case 'fade':
        return { opacity: 1 };
      case 'scale':
        return { opacity: 1, scale: 1 };
      case 'stagger':
      case 'fade-up':
      default:
        return { opacity: 1, y: 0 };
    }
  }

  ngOnDestroy(): void {
    this.tween?.kill();
    this.trigger?.kill();
    this.mutationObserver?.disconnect();
  }
}
