// src/pages/teachers/teachers-page.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { TeachersPageComponent } from './teachers-page.component';
import { TeacherService } from '../../services/teacher.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Teacher } from '../../types/teacher.model';

describe('TeachersPageComponent', () => {
  const teacherList: Teacher[] = [
    { id: 1, name: 'João', email: 'joao@email.com', subject: 'Matemática', phone: '', address: '', dateOfBirth: '', photoUrl: '' },
    { id: 2, name: 'Maria', email: 'maria@email.com', subject: 'Física', phone: '', address: '', dateOfBirth: '', photoUrl: '' },
    { id: 3, name: 'Pedro', email: 'pedro@email.com', subject: 'Química', phone: '', address: '', dateOfBirth: '', photoUrl: '' },
  ];

  let teacherServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    teacherServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(teacherList))
    };

    routerMock = { navigate: jasmine.createSpy('navigate') };

    spyOn(window, 'alert');
  });

  it('should load teachers on init', async () => {
    await render(TeachersPageComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    expect(teacherServiceMock.getAll).toHaveBeenCalled();
    expect(screen.getByText('João')).toBeTruthy();
    expect(screen.getByText('Maria')).toBeTruthy();
    expect(screen.getByText('Pedro')).toBeTruthy();
  });

  it('should alert on load error', async () => {
    const serviceError = { getAll: jasmine.createSpy().and.returnValue(throwError(() => new Error('erro'))) };
    await render(TeachersPageComponent, {
      providers: [
        { provide: TeacherService, useValue: serviceError },
        { provide: Router, useValue: routerMock },
      ]
    });

    expect(window.alert).toHaveBeenCalledWith('Erro ao carregar professores.');
  });

  it('should filter teachers by searchTerm', async () => {
    const { fixture } = await render(TeachersPageComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    const component = fixture.componentInstance;
    component.searchTerm = 'Maria';
    component.onSearchChange();

    expect(component.filteredTeachers.length).toBe(1);
    expect(component.filteredTeachers[0].name).toBe('Maria');
  });

  it('should display "Nenhum professor encontrado" when filtered list is empty', async () => {
    const { fixture } = await render(TeachersPageComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    const component = fixture.componentInstance;
    component.searchTerm = 'Não existe';
    component.onSearchChange();
    fixture.detectChanges();

    expect(screen.getByText('Nenhum professor encontrado.')).toBeTruthy();
  });

  it('should navigate to given path', async () => {
    const { fixture } = await render(TeachersPageComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    const component = fixture.componentInstance;
    component.navigateTo('/teachers/create');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers/create']);
  });
});
