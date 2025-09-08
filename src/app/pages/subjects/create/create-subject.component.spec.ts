// src/pages/subjects/create/create-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CreateSubjectComponent } from './create-subject.component';
import { SubjectService } from '../../../services/subject.service';

describe('CreateSubjectComponent', () => {
  let mockSubjectService: Partial<SubjectService>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockSubjectService = {
      create: jasmine.createSpy('create').and.returnValue(of({})),
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };
  });

  it('should create the component and render form', async () => {
    await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    expect(screen.getByText('Cadastrar Nova Disciplina')).toBeTruthy();
    expect(screen.getByLabelText('Nome da Disciplina')).toBeTruthy();
    expect(screen.getByLabelText('Descrição')).toBeTruthy();
    expect(screen.getByLabelText('Carga Horária (horas)')).toBeTruthy();
    expect(screen.getByText('Salvar')).toBeTruthy();
    expect(screen.getByText('Voltar')).toBeTruthy();
  });

  it('should update subject properties on handleChange', async () => {
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;

    component.handleChange('name', 'Matemática');
    component.handleChange('description', 'Matemática Básica');
    component.handleChange('workloadHours', 80);

    expect(component.subject.name).toBe('Matemática');
    expect(component.subject.description).toBe('Matemática Básica');
    expect(component.subject.workloadHours).toBe(80);
  });

  it('should show validation error if name is empty', async () => {
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    component.subject.name = '';
    component.handleSubmit();

    expect(component.errors.name).toBe('O nome da disciplina é obrigatório.');
  });

  it('should show validation error if workloadHours is 0 or negative', async () => {
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    component.subject.name = 'Física';
    component.subject.workloadHours = 0;
    component.handleSubmit();

    expect(component.errors.workloadHours).toBe('A carga horária deve ser maior que 0.');
  });

  it('should call subjectService.create and navigate when form is valid', async () => {
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    component.subject.name = 'História';
    component.subject.description = 'História Geral';
    component.subject.workloadHours = 60;

    component.handleSubmit();

    expect(mockSubjectService.create).toHaveBeenCalledWith(component.subject);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate back when goBack is called', async () => {
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should call handleSubmit when Salvar button is clicked', async () => {
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    spyOn(component, 'handleSubmit');

    const button = screen.getByText('Salvar');
    fireEvent.click(button);

    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('should call goBack when Voltar button is clicked', async () => {
    const { fixture } = await render(CreateSubjectComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    spyOn(component, 'goBack');

    const button = screen.getByText('Voltar');
    fireEvent.click(button);

    expect(component.goBack).toHaveBeenCalled();
  });
});
