// src/pages/enrollments/edit/edit-enrollment.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EditEnrollmentComponent, EnrollmentEdit } from './edit-enrollment.component';
import { CommonModule } from '@angular/common';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('EditEnrollmentComponent', () => {
  let component: EditEnrollmentComponent;
  let fixture: ComponentFixture<EditEnrollmentComponent>;
  let routerMock: Partial<Router>;
  let onSaveSpy: jasmine.Spy;

  const enrollment: EnrollmentEdit = {
    id: 1,
    studentId: 1,
    classRoomId: 2,
    enrollmentDate: '2025-08-21',
    status: 'Ativo',
  };

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    onSaveSpy = jasmine.createSpy('onSave').and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, EditEnrollmentComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEnrollmentComponent);
    component = fixture.componentInstance;

    component.enrollment = enrollment;
    component.onSave = onSaveSpy;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formData on ngOnInit', () => {
    component.ngOnInit();
    expect(component.formData).toEqual(enrollment);
  });

  it('should update formData on handleChange', () => {
    const event = { target: { value: '5' } } as any as Event;

    component.handleChange(event, 'studentId');
    expect(component.formData.studentId).toBe(5);

    component.handleChange({ target: { value: '10' } } as any as Event, 'classRoomId');
    expect(component.formData.classRoomId).toBe(10);

    component.handleChange({ target: { value: '2025-08-22' } } as any as Event, 'enrollmentDate');
    expect(component.formData.enrollmentDate).toBe('2025-08-22');

    component.handleChange({ target: { value: 'Inativo' } } as any as Event, 'status');
    expect(component.formData.status).toBe('Inativo');
  });

  it('should validate and set errors if fields are missing', async () => {
    component.formData = { ...enrollment, studentId: 0, classRoomId: 0, enrollmentDate: '' };
    await component.handleSubmit();

    expect(component.errors.studentId).toBe('Aluno é obrigatório.');
    expect(component.errors.classRoomId).toBe('Turma é obrigatória.');
    expect(component.errors.enrollmentDate).toBe('Data da matrícula é obrigatória.');
    expect(onSaveSpy).not.toHaveBeenCalled();
  });

  it('should call onSave and navigate if form is valid', fakeAsync(async () => {
    component.formData = { ...enrollment };
    await component.handleSubmit();
    tick();
    expect(onSaveSpy).toHaveBeenCalledWith(enrollment);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('should navigate back on back()', () => {
    component.back();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('should update inputs via ngModel', async () => {
    await render(EditEnrollmentComponent, {
      componentProperties: { enrollment, onSave: onSaveSpy },
      imports: [FormsModule, CommonModule],
    });

    const studentInput = screen.getByLabelText('Aluno') as HTMLInputElement;
    const classInput = screen.getByLabelText('Turma') as HTMLInputElement;
    const dateInput = screen.getByLabelText('Data da Matrícula') as HTMLInputElement;

    fireEvent.input(studentInput, { target: { value: '2' } });
    fireEvent.input(classInput, { target: { value: '1' } });
    fireEvent.input(dateInput, { target: { value: '2025-08-22' } });

    expect(studentInput.value).toBe('2');
    expect(classInput.value).toBe('1');
    expect(dateInput.value).toBe('2025-08-22');
  });
});
