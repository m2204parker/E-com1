import { Component } from '@angular/core';

import { Icon } from '@shared/icon/icon';
import { ScrollReveal } from '@shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-site-footer',
  imports: [Icon, ScrollReveal],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class SiteFooter {}
