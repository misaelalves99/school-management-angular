// src/pages/teachers/delete/delete-teacher.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { DeleteTeacherComponent } from './delete-teacher.component';
import { TeacherService } from '../../../services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('DeleteTeacherComponent', () => {
  const teacherMock = {
    id: 1,
    name: 'João',
    email: 'joao@email.com',
    phone: '123456789',
    dateOfBirth: '1980-01-01',
    subject: 'Matemática',
    address: 'Rua A'
  };

  let teacherServiceMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(() => {
    teacherServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(of(teacherMock)),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
    };

    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = { snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('1') } } };

    spyOn(window, 'alert');
    spyOn(window, 'confirm').and.returnValue(true);
  });

  const setup = () =>
    render(DeleteTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    });

  it('should fetch teacher on init and display data', async () => {
    await setup();

    expect(teacherServiceMock.getById).toHaveBeenCalledWith(1);
    expect(screen.getByText('Excluir')).toBeTruthy();
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('should alert and navigate if id is invalid', async () => {
    const badRoute = { snapshot: { paramMap: { get: () => null } } };
    await render(DeleteTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: badRoute },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('ID inválido.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should alert and navigate if teacher not found', async () => {
    const service = { getById: jasmine.createSpy().and.returnValue(of(null)) };
    await render(DeleteTeacherComponent, {
      providers: [
        { provide: TeacherService, useValue: service },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Professor não encontrado.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should handle delete confirmation and success', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.teacher = teacherMock;

    component.handleDelete();

    expect(window.confirm).toHaveBeenCalledWith('Confirma exclusão do professor: João?');
    expect(teacherServiceMock.delete).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Professor excluído com sucesso.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should not delete if confirm returns false', async () => {
    (window.confirm as jasmine.Spy).and.returnValue(false);
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.teacher = teacherMock;

    component.handleDelete();

    expect(teacherServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should handle delete error', async () => {
    teacherServiceMock.delete.and.returnValue(throwError(() => new Error('Erro teste')));
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.teacher = teacherMock;

    component.handleDelete();

    expect(window.alert).toHaveBeenCalledWith('Erro ao excluir professor: Erro teste');
  });

  it('should navigate on cancel', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;

    component.handleCancel();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/teachers']);
  });

  it('should disable buttons while deleting', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    component.teacher = teacherMock;

    spyOn(window, 'confirm').and.returnValue(true);
    component.handleDelete();

    const deleteButton = screen.getByText('Excluir') as HTMLButtonElement;
    const cancelButton = screen.getByText('Cancelar') as HTMLButtonElement;

    expect(deleteButton.disabled).toBeFalse();
    expect(cancelButton.disabled).toBeFalse();
  });
});
