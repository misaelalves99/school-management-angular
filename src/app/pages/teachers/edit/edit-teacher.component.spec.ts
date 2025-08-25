// src/pages/teachers/edit/edit-teacher.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { EditTeacherComponent } from './edit-teacher.component';
import { TeacherService } from '../../../services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EditTeacherComponent', () => {
  const teacherMock = {
    id: 1,
    name: 'João',
    email: 'joao@email.com',
    dateOfBirth: '2000-01-01',
    subject: 'Matemática',
    phone: '123456789',
    address: 'Rua A',
    photoUrl: ''
  };

  const teacherServiceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(of(teacherMock)),
    update: jasmine.createSpy('update').and.returnValue(of(teacherMock))
  };

  const routerMock = { navigate: jasmine.createSpy('navigate') };
  const routeMock = { snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('1') } } };

  beforeEach(() => {
    spyOn(window, 'alert');
  });

  it('should load teacher on init', async () => {
    await render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    });

    expect(teacherServiceMock.getById).toHaveBeenCalledWith(1);
  });

  it('should alert and navigate if teacher not found', async () => {
    const service = { getById: jasmine.createSpy().and.returnValue(of(null)) };
    await render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: service },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    });

    expect(window.alert).toHaveBeenCalledWith('Professor não encontrado.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should alert and navigate on service error', async () => {
    const service = { getById: jasmine.createSpy().and.returnValue(throwError(() => new Error('erro'))) };
    await render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: service },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    });

    expect(window.alert).toHaveBeenCalledWith('Erro ao carregar professor.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should validate form correctly', async () => {
    const { fixture } = await render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    });

    const component = fixture.componentInstance;

    component.formData.name = '';
    component.formData.email = '';
    component.formData.dateOfBirth = '';
    component.formData.subject = '';

    const valid = component.validate();
    expect(valid).toBeFalse();
    expect(component.errors.name).toBe('Nome é obrigatório.');
    expect(component.errors.email).toBe('Email é obrigatório.');
    expect(component.errors.dateOfBirth).toBe('Data de nascimento é obrigatória.');
    expect(component.errors.subject).toBe('Disciplina é obrigatória.');
  });

  it('should call update and navigate on valid submit', async () => {
    const { fixture } = await render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    });

    const component = fixture.componentInstance;
    component.formData = {
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: 'Matemática',
      phone: '123',
      address: 'Rua A',
      photoUrl: ''
    };

    component.handleSubmit();
    expect(teacherServiceMock.update).toHaveBeenCalledWith(1, component.formData);
    expect(window.alert).toHaveBeenCalledWith('Professor atualizado com sucesso!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should alert on update error', async () => {
    const service = {
      getById: jasmine.createSpy('getById').and.returnValue(of(teacherMock)),
      update: jasmine.createSpy('update').and.returnValue(throwError(() => new Error('erro')))
    };

    const { fixture } = await render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: service },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    });

    const component = fixture.componentInstance;
    component.handleSubmit();

    expect(window.alert).toHaveBeenCalledWith('Erro ao atualizar professor: erro');
  });

  it('should navigate back', async () => {
    const { fixture } = await render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    });

    const component = fixture.componentInstance;
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });
});
