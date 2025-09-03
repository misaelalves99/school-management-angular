// src/pages/enrollments/edit/edit-enrollment.component.spec.ts

// src/pages/enrollments/edit/edit-enrollment.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EditEnrollmentComponent } from './edit-enrollment.component';
import { CommonModule } from '@angular/common';
import { render, screen, fireEvent } from '@testing-library/angular';
import { Enrollment } from '../../../types/enrollment.model';

describe('EditEnrollmentComponent', () => {
  let component: EditEnrollmentComponent;
  let fixture: ComponentFixture<EditEnrollmentComponent>;
  let routerMock: Partial<Router>;

  const enrollment: Enrollment = {
    id: 1,
    studentId: 1,
    classRoomId: 2,
    enrollmentDate: '2025-08-21',
    status: 'Ativo',
  };

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, EditEnrollmentComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEnrollmentComponent);
    component = fixture.componentInstance;
    component.enrollment = enrollment;
    component.formData = { ...enrollment };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on back()', () => {
    component.back();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('should validate and set errors if fields are missing', () => {
    component.formData.studentId = 0 as any;
    component.formData.classRoomId = 0 as any;
    component.formData.enrollmentDate = '';
    component.formData.status = undefined as any;

    component.handleSubmit();

    expect(component.errors.studentId).toBe('Aluno é obrigatório.');
    expect(component.errors.classRoomId).toBe('Turma é obrigatória.');
    expect(component.errors.enrollmentDate).toBe('Data é obrigatória.');
    expect(component.errors.status).toBe('Status é obrigatório.');
  });

  it('should call handleSubmit and navigate if form is valid', fakeAsync(() => {
    component.formData = { ...enrollment };
    spyOn(component['enrollmentService'], 'update');
    component.handleSubmit();
    tick();
    expect(component['enrollmentService'].update).toHaveBeenCalledWith(enrollment);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('should update inputs via ngModel', async () => {
    await render(EditEnrollmentComponent, {
      componentProperties: { formData: { ...enrollment } },
      imports: [FormsModule, CommonModule],
    });

    const studentInput = screen.getByLabelText('Aluno') as HTMLSelectElement;
    const classInput = screen.getByLabelText('Turma') as HTMLSelectElement;
    const dateInput = screen.getByLabelText('Data da Matrícula') as HTMLInputElement;
    const statusInput = screen.getByLabelText('Status') as HTMLSelectElement;

    fireEvent.change(studentInput, { target: { value: '2' } });
    fireEvent.change(classInput, { target: { value: '1' } });
    fireEvent.change(dateInput, { target: { value: '2025-08-22' } });
    fireEvent.change(statusInput, { target: { value: 'Inativo' } });

    expect(studentInput.value).toBe('2');
    expect(classInput.value).toBe('1');
    expect(dateInput.value).toBe('2025-08-22');
    expect(statusInput.value).toBe('Inativo');
  });
});
