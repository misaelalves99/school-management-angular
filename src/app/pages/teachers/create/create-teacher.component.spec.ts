// src/pages/teachers/create/create-teacher.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { CreateTeacherComponent, TeacherFormData } from './create-teacher.component';
import { TeacherService } from '../../../services/teacher.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('CreateTeacherComponent', () => {
  const teacherServiceMock = {
    create: jasmine.createSpy('create').and.callFake((data: TeacherFormData) => of(data))
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  it('should create the component and render form fields', async () => {
    await render(CreateTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    expect(screen.getByLabelText('Nome')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Data de Nascimento')).toBeTruthy();
    expect(screen.getByLabelText('Disciplina')).toBeTruthy();
  });

  it('should validate required fields', async () => {
    const { fixture } = await render(CreateTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    const component = fixture.componentInstance;
    component.formData = {
      name: '',
      email: '',
      dateOfBirth: '',
      subject: '',
      phone: '',
      address: ''
    };

    expect(component.validate()).toBeFalse();
    expect(component.errors.name).toBe('Nome é obrigatório.');
    expect(component.errors.email).toBe('Email é obrigatório.');
    expect(component.errors.dateOfBirth).toBe('Data de nascimento é obrigatória.');
    expect(component.errors.subject).toBe('Disciplina é obrigatória.');
  });

  it('should validate email format', async () => {
    const { fixture } = await render(CreateTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    const component = fixture.componentInstance;
    component.formData.email = 'invalid-email';
    component.formData.name = 'Teste';
    component.formData.dateOfBirth = '2000-01-01';
    component.formData.subject = 'Matemática';

    expect(component.validate()).toBeFalse();
    expect(component.errors.email).toBe('Email inválido.');
  });

  it('should call teacherService.create and navigate on valid submit', async () => {
    const { fixture } = await render(CreateTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    const component = fixture.componentInstance;
    component.formData = {
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: 'Matemática',
      phone: '123456789',
      address: 'Rua A'
    };

    spyOn(window, 'alert'); // evita pop-up real
    component.handleSubmit();

    expect(teacherServiceMock.create).toHaveBeenCalledWith(component.formData);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
    expect(window.alert).toHaveBeenCalledWith('Professor salvo com sucesso!');
  });

  it('should show alert on service error', async () => {
    teacherServiceMock.create.and.returnValue(throwError(() => new Error('Erro teste')));
    const { fixture } = await render(CreateTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    const component = fixture.componentInstance;
    component.formData = {
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: 'Matemática',
      phone: '123456789',
      address: 'Rua A'
    };

    spyOn(window, 'alert');
    component.handleSubmit();

    expect(window.alert).toHaveBeenCalledWith('Erro ao salvar professor: Erro teste');
  });
});
