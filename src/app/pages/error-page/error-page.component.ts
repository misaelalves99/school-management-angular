// src/pages/error-page/error-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationExtras } from '@angular/router';

interface ErrorData {
  message: string;
  stack?: string;
}

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css'],
})
export class ErrorPageComponent {
  error?: ErrorData;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { error?: ErrorData } | undefined;
    this.error = state?.error;
  }
}
