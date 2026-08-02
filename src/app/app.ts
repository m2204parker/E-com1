import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AnnouncementBar } from '@features/shell/announcement-bar/announcement-bar';
import { SiteFooter } from '@features/shell/footer/footer';
import { SiteHeader } from '@features/shell/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AnnouncementBar, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
