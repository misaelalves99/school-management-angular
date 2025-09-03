// src/pages/subjects/edit/edit-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { EditSubjectComponent } from './edit-subject.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('EditSubjectComponent', () => {
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
  });

  it('should create the component and display initial data', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    expect(screen.getByText('Editar Disciplina')).toBeTruthy();
    expect((screen.getByLabelText('Nome da Disciplina') as HTMLInputElement).value).toBe('Matemática');
    expect((screen.getByLabelText('Descrição') as HTMLTextAreaElement).value).toBe('Disciplina de matemática básica');
    expect((screen.getByLabelText('Carga Horária (horas)') as HTMLInputElement).value).toBe('60');
  });

  it('should display validation error if name is empty', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    const nameInput = screen.getByLabelText('Nome da Disciplina') as HTMLInputElement;
    nameInput.value = '';
    fireEvent.input(nameInput);

    const submitButton = screen.getByText('Salvar Alterações');
    fireEvent.click(submitButton);

    expect(screen.getByText('O nome da disciplina é obrigatório.')).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should display validation error if workloadHours is invalid', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    const workloadInput = screen.getByLabelText('Carga Horária (horas)') as HTMLInputElement;
    workloadInput.value = '0';
    fireEvent.input(workloadInput);

    const submitButton = screen.getByText('Salvar Alterações');
    fireEvent.click(submitButton);

    expect(screen.getByText('A carga horária deve ser maior que zero.')).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate after successful submit', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    const submitButton = screen.getByText('Salvar Alterações');
    fireEvent.click(submitButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate back when back button is clicked', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
