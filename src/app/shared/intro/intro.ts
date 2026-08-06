import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  output,
} from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-intro',
  standalone: true,
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro implements AfterViewInit, OnDestroy {
  readonly done = output<void>();

  @ViewChild('panel', { static: true }) panelRef!: ElementRef<HTMLElement>;
  @ViewChild('word', { static: true }) wordRef!: ElementRef<HTMLElement>;
  @ViewChild('barFill', { static: true }) barFillRef!: ElementRef<HTMLElement>;
  @ViewChild('count', { static: true }) countRef!: ElementRef<HTMLElement>;

  protected readonly letters = 'WRAP'.split('');

  private timeline: gsap.core.Timeline | null = null;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.play());
  }

  private play(): void {
    const letters = this.wordRef.nativeElement.querySelectorAll(
      '.pl-intro__letter',
    );
    const panel = this.panelRef.nativeElement;
    const barFill = this.barFillRef.nativeElement;
    const countEl = this.countRef.nativeElement;
    const progress = { value: 0 };

    this.timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => this.zone.run(() => this.done.emit()),
    });

    this.timeline
      .set(letters, { yPercent: 110, opacity: 0 })
      .to(letters, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.045,
      })
      .to(
        barFill,
        { scaleX: 1, duration: 1.05, ease: 'power2.inOut' },
        '<0.1',
      )
      .to(
        progress,
        {
          value: 100,
          duration: 1.05,
          ease: 'power2.inOut',
          onUpdate: () => {
            countEl.textContent = `${Math.round(progress.value)}%`;
          },
        },
        '<',
      )
      .to(letters, {
        yPercent: -110,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.in',
      })
      .to(
        panel,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 12%)',
          duration: 0.85,
          ease: 'power4.inOut',
        },
        '-=0.15',
      );
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
  }
}
