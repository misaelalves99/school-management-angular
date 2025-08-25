// src/pages/error-page/error-page.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ErrorPageComponent } from './error-page.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { render, screen } from '@testing-library/angular';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    routerMock = {
      getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue({
        extras: { state: { error: { message: 'Erro de teste', stack: 'stack trace' } } },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ErrorPageComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize error from router state', () => {
    expect(component.error).toBeDefined();
    expect(component.error?.message).toBe('Erro de teste');
    expect(component.error?.stack).toBe('stack trace');
  });

  it('should render static error texts', () => {
    const title = fixture.nativeElement.querySelector('.errorTitle');
    const desc = fixture.nativeElement.querySelector('.errorDescription');
    expect(title.textContent).toContain('Ops! Algo deu errado.');
    expect(desc.textContent).toContain('Desculpe, ocorreu um erro inesperado');
  });

  it('should render error details if error is present', () => {
    const details = fixture.nativeElement.querySelector('.errorDetails');
    expect(details).toBeTruthy();
    expect(details.textContent).toContain('Erro de teste');
    expect(details.textContent).toContain('stack trace');
  });

  it('should not render error details if error is absent', async () => {
    await render(ErrorPageComponent, {
      imports: [CommonModule],
      providers: [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({ extras: { state: {} } }),
          },
        },
      ],
    });

    const details = screen.queryByText('Detalhes do Erro:');
    expect(details).toBeNull();
  });
});
