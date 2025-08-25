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

  const teacherServiceMock = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of(teacherList))
  };
  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
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

  it('should paginate correctly', async () => {
    const { fixture } = await render(TeachersPageComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    const component = fixture.componentInstance;
    expect(component.totalPages).toBe(2); // PAGE_SIZE = 2
    expect(component.currentItems.length).toBe(2);

    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.currentItems.length).toBe(1);

    // invalid pages
    component.goToPage(0);
    expect(component.currentPage).toBe(2);
    component.goToPage(3);
    expect(component.currentPage).toBe(2);
  });

  it('should reset page on search change', async () => {
    const { fixture } = await render(TeachersPageComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    const component = fixture.componentInstance;
    component.currentPage = 2;
    component.searchTerm = 'Maria';
    component.onSearchChange();
    expect(component.currentPage).toBe(1);
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
});
