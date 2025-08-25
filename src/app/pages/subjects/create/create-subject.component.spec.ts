// src/pages/subjects/create/create-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { CreateSubjectComponent } from './create-subject.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('CreateSubjectComponent', () => {
  it('should create the component', async () => {
    await render(CreateSubjectComponent, { imports: [FormsModule] });
    expect(screen.getByText('Cadastrar Nova Disciplina')).toBeTruthy();
  });

  it('should update subject.name and subject.description on handleChange', async () => {
    const { fixture } = await render(CreateSubjectComponent, { imports: [FormsModule] });
    const component = fixture.componentInstance;

    component.handleChange('name', 'Matemática');
    component.handleChange('description', 'Disciplina de matemática básica');

    expect(component.subject.name).toBe('Matemática');
    expect(component.subject.description).toBe('Disciplina de matemática básica');
  });

  it('should show error if name is empty on submit', async () => {
    const { fixture } = await render(CreateSubjectComponent, { imports: [FormsModule] });
    const component = fixture.componentInstance;

    component.subject.name = '';
    component.handleSubmit();

    expect(component.errors.name).toBe('O nome da disciplina é obrigatório.');
  });

  it('should navigate to /subjects when form is valid', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    const component = fixture.componentInstance;
    component.subject.name = 'História';
    component.subject.description = 'História Geral';
    component.handleSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate back when goBack is called', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    const component = fixture.componentInstance;
    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
