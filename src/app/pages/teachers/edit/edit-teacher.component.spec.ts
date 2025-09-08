// src/pages/teachers/edit/edit-teacher.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { EditTeacherComponent } from './edit-teacher.component';
import { TeacherService } from '../../../services/teacher.service';
import { SubjectService } from '../../../services/subject.service';
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

  const subjectsMock = [
    { id: 1, name: 'Matemática' },
    { id: 2, name: 'Português' }
  ];

  let teacherServiceMock: any;
  let subjectServiceMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(() => {
    teacherServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(of(teacherMock)),
      update: jasmine.createSpy('update').and.returnValue(of(teacherMock))
    };

    subjectServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(subjectsMock))
    };

    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = { snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('1') } } };

    spyOn(window, 'alert');
  });

  const setup = () =>
    render(EditTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ],
    });

  it('should load teacher and subjects on init', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    expect(subjectServiceMock.getAll).toHaveBeenCalled();
    expect(teacherServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.formData.name).toBe('João');
    expect(component.loading).toBeFalse();
  });

  it('should alert and navigate if teacher not found', async () => {
    teacherServiceMock.getById.and.returnValue(of(null));
    await setup();
    expect(window.alert).toHaveBeenCalledWith('Professor não encontrado.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should alert and navigate on getById error', async () => {
    teacherServiceMock.getById.and.returnValue(throwError(() => new Error('erro')));
    await setup();
    expect(window.alert).toHaveBeenCalledWith('Erro ao carregar professor.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should validate form correctly', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.formData = { ...component.formData, name: '', email: '', dateOfBirth: '', subject: '' };
    const valid = component.validate();
    expect(valid).toBeFalse();
    expect(component.errors.name).toBe('Nome é obrigatório.');
    expect(component.errors.email).toBe('Email é obrigatório.');
    expect(component.errors.dateOfBirth).toBe('Data de nascimento é obrigatória.');
    expect(component.errors.subject).toBe('Disciplina é obrigatória.');
  });

  it('should call update and navigate on valid submit', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.formData = { ...teacherMock };
    component.handleSubmit();
    expect(teacherServiceMock.update).toHaveBeenCalledWith(1, component.formData);
    expect(window.alert).toHaveBeenCalledWith('Professor atualizado com sucesso!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should alert on update error', async () => {
    teacherServiceMock.update.and.returnValue(throwError(() => new Error('erro')));
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.formData = { ...teacherMock };
    component.handleSubmit();
    expect(window.alert).toHaveBeenCalledWith('Erro ao atualizar professor: erro');
  });

  it('should navigate back', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should display subjects in select', async () => {
    await setup();
    expect(screen.getByText('Selecione uma disciplina')).toBeTruthy();
    expect(screen.getByText('Matemática')).toBeTruthy();
    expect(screen.getByText('Português')).toBeTruthy();
  });
});
