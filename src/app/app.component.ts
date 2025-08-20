// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

// Navbar
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main style="padding: 1rem;">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
    title = 'app-angular';
}
