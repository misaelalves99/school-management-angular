// src/pages/enrollments/create/create-enrollment.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateEnrollmentComponent, EnrollmentForm, Student, ClassRoom } from './create-enrollment.component';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('CreateEnrollmentComponent', () => {
  let component: CreateEnrollmentComponent;
  let fixture: ComponentFixture<CreateEnrollmentComponent>;
  let routerMock: Partial<Router>;
  let onCreateSpy: jasmine.Spy;

  const students: Student[] = [
    { id: 1, name: 'Aluno A' },
    { id: 2, name: 'Aluno B' },
  ];

  const classRooms: ClassRoom[] = [
    { id: 1, name: 'Sala A' },
    { id: 2, name: 'Sala B' },
  ];

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    onCreateSpy = jasmine.createSpy('onCreate').and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [FormsModule, CreateEnrollmentComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEnrollmentComponent);
    component = fixture.componentInstance;

    component.students = students;
    component.classRooms = classRooms;
    component.onCreate = onCreateSpy;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form and set errors', () => {
    component.form = { studentId: '', classRoomId: '', enrollmentDate: '' };
    const valid = component.validate();
    expect(valid).toBeFalse();
    expect(component.errors.studentId).toBe('Aluno é obrigatório.');
    expect(component.errors.classRoomId).toBe('Turma é obrigatória.');
    expect(component.errors.enrollmentDate).toBe('Data da matrícula é obrigatória.');
  });

  it('should not call onCreate if form is invalid', async () => {
    component.form = { studentId: '', classRoomId: '', enrollmentDate: '' };
    await component.handleSubmit();
    expect(onCreateSpy).not.toHaveBeenCalled();
  });

  it('should call onCreate and navigate if form is valid', fakeAsync(async () => {
    component.form = { studentId: 1, classRoomId: 2, enrollmentDate: '2025-08-21' };
    await component.handleSubmit();
    tick();
    expect(onCreateSpy).toHaveBeenCalledWith(component.form);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('should navigate back on goBack', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('should update form fields via ngModel', async () => {
    await render(CreateEnrollmentComponent, {
      componentProperties: {
        students,
        classRooms,
        onCreate: onCreateSpy,
      },
      imports: [FormsModule],
    });

    const studentSelect = screen.getByLabelText('Aluno') as HTMLSelectElement;
    const classRoomSelect = screen.getByLabelText('Turma') as HTMLSelectElement;
    const dateInput = screen.getByLabelText('Data da Matrícula') as HTMLInputElement;

    fireEvent.change(studentSelect, { target: { value: '2' } });
    fireEvent.change(classRoomSelect, { target: { value: '1' } });
    fireEvent.change(dateInput, { target: { value: '2025-08-22' } });

    expect(studentSelect.value).toBe('2');
    expect(classRoomSelect.value).toBe('1');
    expect(dateInput.value).toBe('2025-08-22');
  });
});
