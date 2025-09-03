// src/pages/enrollments/create/create-enrollment.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateEnrollmentComponent } from './create-enrollment.component';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';
import { EnrollmentService } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';
import { of } from 'rxjs';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('CreateEnrollmentComponent', () => {
  let component: CreateEnrollmentComponent;
  let fixture: ComponentFixture<CreateEnrollmentComponent>;
  let routerMock: Partial<Router>;
  let enrollmentServiceMock: Partial<EnrollmentService>;
  let studentServiceMock: Partial<StudentService>;
  let classRoomServiceMock: Partial<ClassRoomService>;

  const students: Student[] = [
    { id: 1, name: 'Aluno A', email: 'a@email.com', dateOfBirth: '2005-01-01', enrollmentNumber: 'EN001', phone: '123456789', address: 'Rua A, 123' },
    { id: 2, name: 'Aluno B', email: 'b@email.com', dateOfBirth: '2006-02-02', enrollmentNumber: 'EN002', phone: '987654321', address: 'Rua B, 456' },
  ];

  const classRooms: ClassRoom[] = [
    { id: 1, name: 'Sala A', capacity: 30, schedule: 'Seg 08:00-10:00', subjects: [], teachers: [], classTeacher: undefined },
    { id: 2, name: 'Sala B', capacity: 25, schedule: 'Ter 10:00-12:00', subjects: [], teachers: [], classTeacher: undefined },
  ];

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    enrollmentServiceMock = { add: jasmine.createSpy('add') };
    studentServiceMock = { getAll: () => of(students) };
    classRoomServiceMock = { getAll: () => of(classRooms) };

    await TestBed.configureTestingModule({
      imports: [FormsModule, CreateEnrollmentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: EnrollmentService, useValue: enrollmentServiceMock },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: ClassRoomService, useValue: classRoomServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar formulário e setar erros', () => {
    component.form = { studentId: undefined, classRoomId: undefined, enrollmentDate: '' };
    const valid = component.validate();
    expect(valid).toBeFalse();
    expect(component.errors.studentId).toBe('Aluno é obrigatório.');
    expect(component.errors.classRoomId).toBe('Turma é obrigatória.');
    expect(component.errors.enrollmentDate).toBe('Data da matrícula é obrigatória.');
  });

  it('não deve chamar enrollmentService.add se formulário inválido', fakeAsync(async () => {
    component.form = { studentId: undefined, classRoomId: undefined, enrollmentDate: '' };
    await component.handleSubmit();
    tick();
    expect(enrollmentServiceMock.add).not.toHaveBeenCalled();
  }));

  it('deve chamar enrollmentService.add e navegar se formulário válido', fakeAsync(async () => {
    component.form = { studentId: 1, classRoomId: 2, enrollmentDate: '2025-08-21', status: 'Ativo' };
    await component.handleSubmit();
    tick();
    expect(enrollmentServiceMock.add).toHaveBeenCalledWith(jasmine.objectContaining({
      studentId: 1,
      classRoomId: 2,
      enrollmentDate: '2025-08-21',
      status: 'Ativo',
    }));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('deve navegar para /enrollments ao chamar goBack', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('deve atualizar campos do formulário via ngModel', async () => {
    await render(CreateEnrollmentComponent, {
      imports: [FormsModule],
      componentProperties: { students, classRooms },
    });

    const studentSelect = screen.getByLabelText('Aluno') as HTMLSelectElement;
    const classRoomSelect = screen.getByLabelText('Turma') as HTMLSelectElement;
    const dateInput = screen.getByLabelText('Data da Matrícula') as HTMLInputElement;
    const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;

    fireEvent.change(studentSelect, { target: { value: '2' } });
    fireEvent.change(classRoomSelect, { target: { value: '1' } });
    fireEvent.change(dateInput, { target: { value: '2025-08-22' } });
    fireEvent.change(statusSelect, { target: { value: 'Inativo' } });

    expect(studentSelect.value).toBe('2');
    expect(classRoomSelect.value).toBe('1');
    expect(dateInput.value).toBe('2025-08-22');
    expect(statusSelect.value).toBe('Inativo');
  });
});
