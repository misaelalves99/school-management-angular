// src/pages/teachers/create/create-teacher.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { CreateTeacherComponent } from './create-teacher.component';
import { TeacherService } from '../../../services/teacher.service';
import { SubjectService } from '../../../services/subject.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('CreateTeacherComponent', () => {
  const subjectsMock = [
    { id: 1, name: 'Matemática', description: '', workloadHours: 60 },
    { id: 2, name: 'Física', description: '', workloadHours: 60 },
  ];

  const teacherServiceMock = {
    create: jasmine.createSpy('create').and.callFake((data) => of(data)),
  };

  const subjectServiceMock = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of(subjectsMock)),
  };

  const routerMock = { navigate: jasmine.createSpy('navigate') };

  it('should render form fields and load subjects', async () => {
    await render(CreateTeacherComponent, {
      imports: [FormsModule],
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    expect(screen.getByLabelText('Nome')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Data de Nascimento')).toBeTruthy();
    expect(screen.getByLabelText('Disciplina')).toBeTruthy();

    const options = screen.getAllByRole('option');
    expect(options.length).toBe(3); // "Selecione uma disciplina" + 2 disciplinas
  });

  it('should validate required fields', async () => {
    const { fixture } = await render(CreateTeacherComponent, {
      imports: [FormsModule],
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const component = fixture.componentInstance;
    component.formData = {
      name: '',
      email: '',
      dateOfBirth: '',
      subject: '',
      phone: '',
      address: '',
    };

    expect(component.validate()).toBeFalse();
    expect(component.errors.name).toBe('Nome é obrigatório.');
    expect(component.errors.email).toBe('Email é obrigatório.');
    expect(component.errors.dateOfBirth).toBe('Data de nascimento é obrigatória.');
    expect(component.errors.subject).toBe('Disciplina é obrigatória.');
  });

  it('should validate email format', async () => {
    const { fixture } = await render(CreateTeacherComponent, {
      imports: [FormsModule],
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const component = fixture.componentInstance;
    component.formData.name = 'Teste';
    component.formData.email = 'invalid-email';
    component.formData.dateOfBirth = '2000-01-01';
    component.formData.subject = '1';

    expect(component.validate()).toBeFalse();
    expect(component.errors.email).toBe('Email inválido.');
  });

  it('should call teacherService.create and navigate on valid submit', async () => {
    const { fixture } = await render(CreateTeacherComponent, {
      imports: [FormsModule],
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const component = fixture.componentInstance;
    component.formData = {
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: '1',
      phone: '123456789',
      address: 'Rua A',
    };

    spyOn(window, 'alert');
    component.handleSubmit();

    expect(teacherServiceMock.create).toHaveBeenCalledWith({
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: 'Matemática',
      phone: '123456789',
      address: 'Rua A',
    });

    expect(window.alert).toHaveBeenCalledWith('Professor cadastrado com sucesso!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should show alert on service error', async () => {
    teacherServiceMock.create.and.returnValue(throwError(() => new Error('Erro teste')));

    const { fixture } = await render(CreateTeacherComponent, {
      imports: [FormsModule],
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const component = fixture.componentInstance;
    component.formData = {
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: '1',
      phone: '123456789',
      address: 'Rua A',
    };

    spyOn(window, 'alert');
    component.handleSubmit();

    expect(window.alert).toHaveBeenCalledWith('Erro ao cadastrar professor: Erro teste');
  });

  it('should navigate back when goBack is called', async () => {
    const { fixture } = await render(CreateTeacherComponent, {
      imports: [FormsModule],
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const component = fixture.componentInstance;
    component.goBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });
});
