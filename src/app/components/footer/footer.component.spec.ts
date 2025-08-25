// src/components/footer/footer.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('deve criar o componente', async () => {
    const { fixture } = await render(FooterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve definir currentYear corretamente', async () => {
    const { fixture } = await render(FooterComponent);
    const currentYear = new Date().getFullYear();
    expect(fixture.componentInstance.currentYear).toBe(currentYear);
  });

  it('deve renderizar o ano atual no template', async () => {
    await render(FooterComponent);
    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(`© ${currentYear} Minha Escola`)
    ).toBeTruthy();
  });
});
