// src/pages/subjects/edit/edit-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { EditSubjectComponent } from './edit-subject.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

const createActivatedRouteMock = (id: string | null): Partial<ActivatedRoute> => {
  const mockParamMap: ParamMap = {
    get: (_key: string) => id,
    getAll: (_key: string) => (id ? [id] : []),
    has: (_key: string) => id !== null,
    keys: id ? ['id'] : []
  };
  return { snapshot: { paramMap: mockParamMap } as any };
};

describe('EditSubjectComponent', () => {
  let mockRouter: Partial<Router>;
  let mockSubjectService: any;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockSubjectService = {
      getById: jasmine.createSpy('getById').and.returnValue(of({
        id: 1,
        name: 'Matemática',
        description: 'Disciplina de matemática básica',
        workloadHours: 60
      })),
      update: jasmine.createSpy('update').and.returnValue(of({}))
    };
  });

  it('should create component and render initial data', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('1') },
        { provide: 'SubjectService', useValue: mockSubjectService },
        { provide: EditSubjectComponent, useValue: mockSubjectService }
      ]
    });

    expect(screen.getByText('Editar Disciplina')).toBeTruthy();
    expect((screen.getByLabelText('Nome da Disciplina') as HTMLInputElement).value).toBe('Matemática');
    expect((screen.getByLabelText('Descrição') as HTMLTextAreaElement).value).toBe('Disciplina de matemática básica');
    expect((screen.getByLabelText('Carga Horária (horas)') as HTMLInputElement).value).toBe('60');
  });

  it('should show validation error if name is empty', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('1') },
        { provide: 'SubjectService', useValue: mockSubjectService }
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

  it('should show validation error if workloadHours is invalid', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('1') },
        { provide: 'SubjectService', useValue: mockSubjectService }
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

  it('should call update and navigate on valid submit', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('1') },
        { provide: 'SubjectService', useValue: mockSubjectService }
      ]
    });

    const submitButton = screen.getByText('Salvar Alterações');
    fireEvent.click(submitButton);

    expect(mockSubjectService.update).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate back when back button is clicked', async () => {
    await render(EditSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('1') },
        { provide: 'SubjectService', useValue: mockSubjectService }
      ]
    });

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
