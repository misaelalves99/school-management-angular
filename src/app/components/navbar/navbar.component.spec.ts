// src/components/navbar/navbar.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  it('deve criar o componente', async () => {
    const { fixture } = await render(NavbarComponent, {
      imports: [RouterTestingModule],
    });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar o logo', async () => {
    await render(NavbarComponent, { imports: [RouterTestingModule] });
    expect(screen.getByText('Minha Escola')).toBeTruthy();
  });

  it('deve conter os links principais', async () => {
    await render(NavbarComponent, { imports: [RouterTestingModule] });
    const links = [
      'Início',
      'Alunos',
      'Professores',
      'Disciplinas',
      'Salas',
      'Matrículas',
    ];
    links.forEach(linkText => {
      expect(screen.getByText(linkText)).toBeTruthy();
    });
  });
});
