// src/pages/home/home-page.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { render, screen } from '@testing-library/angular';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render welcome title and description', () => {
    const title = fixture.nativeElement.querySelector('h1');
    const lead = fixture.nativeElement.querySelector('.lead');

    expect(title.textContent).toContain('Bem-vindo ao Sistema');
    expect(lead.textContent).toContain('Gerencie seus alunos, turmas e matrículas de forma simples e rápida');
  });

  it('should render navigation links with correct routerLink', async () => {
    await render(HomePageComponent, { imports: [CommonModule] });

    const alunosLink = screen.getByText('Alunos');
    const turmasLink = screen.getByText('Turmas');
    const matriculasLink = screen.getByText('Matrículas');

    expect(alunosLink.getAttribute('ng-reflect-router-link')).toBe('/students');
    expect(turmasLink.getAttribute('ng-reflect-router-link')).toBe('/classrooms');
    expect(matriculasLink.getAttribute('ng-reflect-router-link')).toBe('/enrollments');
  });

  it('should render all three feature cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.feature-card');
    expect(cards.length).toBe(3);
  });
});
