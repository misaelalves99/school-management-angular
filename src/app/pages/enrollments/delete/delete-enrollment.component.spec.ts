// src/pages/enrollments/delete/delete-enrollment.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DeleteEnrollmentComponent, EnrollmentDetails } from './delete-enrollment.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('DeleteEnrollmentComponent', () => {
  let component: DeleteEnrollmentComponent;
  let fixture: ComponentFixture<DeleteEnrollmentComponent>;
  let routerMock: Partial<Router>;
  let onDeleteSpy: jasmine.Spy;

  const enrollment: EnrollmentDetails = {
    id: 1,
    studentName: 'Aluno A',
    classRoomName: 'Sala A',
    enrollmentDate: '2025-08-21',
    status: 'active',
  };

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    onDeleteSpy = jasmine.createSpy('onDelete').and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [CommonModule, DeleteEnrollmentComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEnrollmentComponent);
    component = fixture.componentInstance;

    component.enrollment = enrollment;
    component.onDelete = onDeleteSpy;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onDelete and navigate on handleDelete', fakeAsync(async () => {
    await component.handleDelete();
    tick();
    expect(onDeleteSpy).toHaveBeenCalledWith(enrollment.id);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('should navigate on cancel', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('should render enrollment details correctly', async () => {
    await render(DeleteEnrollmentComponent, {
      componentProperties: { enrollment, onDelete: onDeleteSpy },
      imports: [CommonModule],
    });

    expect(screen.getByText('Aluno: Aluno A')).toBeTruthy();
    expect(screen.getByText('Turma: Sala A')).toBeTruthy();
    expect(screen.getByText(/Data da Matrícula:/)).toBeTruthy();
  });

  it('should handle null studentName or classRoomName', async () => {
    const nullEnrollment = { ...enrollment, studentName: null, classRoomName: null };
    await render(DeleteEnrollmentComponent, {
      componentProperties: { enrollment: nullEnrollment, onDelete: onDeleteSpy },
      imports: [CommonModule],
    });

    expect(screen.getByText('Aluno: Aluno não informado')).toBeTruthy();
    expect(screen.getByText('Turma: Turma não informada')).toBeTruthy();
  });
});
