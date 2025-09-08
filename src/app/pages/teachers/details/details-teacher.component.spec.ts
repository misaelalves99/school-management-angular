// src/pages/teachers/details/details-teacher.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { DetailsTeacherComponent } from './details-teacher.component';
import { TeacherService } from '../../../services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('DetailsTeacherComponent', () => {
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

  let teacherServiceMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(() => {
    teacherServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(of(teacherMock))
    };

    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = { snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('1') } } };

    spyOn(window, 'alert');
  });

  const setup = () =>
    render(DetailsTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    });

  it('should fetch teacher on init and format date', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;

    expect(teacherServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.teacher).toEqual(teacherMock);

    const expectedDate = new Date(teacherMock.dateOfBirth).toLocaleDateString();
    expect(component.formattedDate).toBe(expectedDate);
  });

  it('should alert and navigate if id is invalid', async () => {
    const badRoute = { snapshot: { paramMap: { get: () => null } } };
    await render(DetailsTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: badRoute },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('ID inválido');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should alert and navigate if teacher not found', async () => {
    const service = { getById: jasmine.createSpy().and.returnValue(of(null)) };
    await render(DetailsTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: service },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Professor não encontrado.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should alert and navigate on service error', async () => {
    const service = { getById: jasmine.createSpy().and.returnValue(throwError(() => new Error('erro'))) };
    await render(DetailsTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: service },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Erro ao carregar professor.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should navigate to edit teacher', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.teacher = teacherMock;

    component.editTeacher();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers/edit/1']);
  });

  it('should navigate back', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;

    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should display teacher details in template', async () => {
    await setup();
    expect(screen.getByText('Detalhes do Professor')).toBeTruthy();
    expect(screen.getByText('Nome:')).toBeTruthy();
    expect(screen.getByText('Email:')).toBeTruthy();
    expect(screen.getByText('Data de Nascimento:')).toBeTruthy();
    expect(screen.getByText('Disciplina:')).toBeTruthy();
    expect(screen.getByText('Telefone:')).toBeTruthy();
    expect(screen.getByText('Endereço:')).toBeTruthy();
  });
});
