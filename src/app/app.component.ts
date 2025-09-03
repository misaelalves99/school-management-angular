// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// Navbar e Footer
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main style="padding: 1rem; min-height: calc(100vh - 120px);">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `,
})
export class AppComponent {
  title = 'app-angular';
}
