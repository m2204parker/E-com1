import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { Icon } from '@shared/icon/icon';
import { ImageService } from '@core/services/image.service';

export type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Progressive image with an industrial loading pipeline:
 *
 *  1. LQIP  – a ~24px thumbnail is painted immediately as a blurred
 *             placeholder (perceived load < 1 request).
 *  2. Skeleton – shimmer while the real image is not yet requested.
 *  3. Lazy  – IntersectionObserver starts the fetch only when the frame is
 *             near the viewport (rootMargin 300px), so off-screen cards never
 *             consume bandwidth.
 *  4. srcset – one CDN request at the size the layout actually needs.
 *  5. Controlled swap – the <img> is mounted only after the bytes are cached,
 *             then faded in (no layout shift thanks to a fixed aspect ratio).
 *  6. Hover – a secondary image is preloaded in parallel and swapped on hover.
 *
 * Usage in grids: pass `[eager]="i < 4"` for the above-the-fold row so it
 * loads with `fetchpriority="high"` and skips the observer entirely.
 */
@Component({
  selector: 'app-lazy-image',
  imports: [Icon],
  templateUrl: './lazy-image.html',
  styleUrl: './lazy-image.scss',
})
export class LazyImage implements AfterViewInit, OnDestroy {
  /** Exposed so the template can compute intrinsic height. */
  protected readonly Math = Math;

  private readonly imageService = inject(ImageService);
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');

  readonly src = input.required<string>();
  readonly alt = input<string>('');
  readonly hoverSrc = input<string | null>(null);
  readonly width = input<number>(810);
  readonly aspectRatio = input<string>('4 / 5');
  readonly sizes = input<string>(
    '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'
  );
  readonly eager = input<boolean>(false);
  readonly fetchPriority = input<'high' | 'low' | 'auto'>('auto');
  readonly radius = input<string>('0px');

  readonly status = signal<ImageStatus>('idle');
  readonly isHovering = signal(false);

  readonly responsive = computed(() =>
    this.imageService.build(this.src(), this.width())
  );

  readonly hoverUrl = computed(() =>
    this.hoverSrc() ? this.imageService.buildUrl(this.hoverSrc()!, this.width()) : null
  );

  readonly placeholderStyle = computed(() => ({
    'background-image': `url(${this.responsive().placeholder})`,
  }));

  private observer: IntersectionObserver | null = null;
  private loader: HTMLImageElement | null = null;
  private started = false;

  ngAfterViewInit(): void {
    if (this.eager()) {
      this.startLoad();
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.startLoad();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.startLoad();
            this.observer?.disconnect();
            this.observer = null;
            break;
          }
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );
    this.observer.observe(this.frame().nativeElement);
  }

  private startLoad(): void {
    if (this.started) return;
    this.started = true;

    const res = this.responsive();

    // Warm the hover image in parallel so hover swaps are instant.
    if (this.hoverSrc()) {
      void this.imageService.preload([this.hoverUrl()!]);
    }

    this.status.set('loading');
    this.loader = new Image();
    this.loader.decoding = 'async';
    this.loader.srcset = res.srcset;
    this.loader.sizes = this.sizes();
    this.loader.src = res.src;
    this.loader.onload = () => this.status.set('loaded');
    this.loader.onerror = () => this.status.set('error');
  }

  onMouseEnter(): void {
    this.isHovering.set(true);
  }

  onMouseLeave(): void {
    this.isHovering.set(false);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.loader) {
      this.loader.onload = null;
      this.loader.onerror = null;
    }
  }
}
