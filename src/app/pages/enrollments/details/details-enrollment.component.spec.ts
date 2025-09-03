// src/pages/enrollments/details/details-enrollment.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DetailsEnrollmentComponent, EnrollmentDetails } from './details-enrollment.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { render, screen } from '@testing-library/angular';

describe('DetailsEnrollmentComponent', () => {
  let component: DetailsEnrollmentComponent;
  let fixture: ComponentFixture<DetailsEnrollmentComponent>;
  let routerMock: Partial<Router>;

  const enrollment: EnrollmentDetails = {
    id: 1,
    studentName: 'Aluno A',
    classRoomName: 'Sala A',
    status: 'Ativo',
    enrollmentDate: '2025-08-21',
  };

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [CommonModule, DetailsEnrollmentComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsEnrollmentComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.enrollment = enrollment;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate to edit page on edit()', () => {
    component.enrollment = enrollment;
    fixture.detectChanges();

    component.edit();
    expect(routerMock.navigate).toHaveBeenCalledWith([`/enrollments/edit/${enrollment.id}`]);
  });

  it('should navigate back on back()', () => {
    component.back();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('should render enrollment details correctly', async () => {
    await render(DetailsEnrollmentComponent, {
      componentProperties: { enrollment },
      imports: [CommonModule],
    });

    expect(screen.getByText('Aluno')).toBeTruthy();
    expect(screen.getByText('Aluno A')).toBeTruthy();
    expect(screen.getByText('Turma')).toBeTruthy();
    expect(screen.getByText('Sala A')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Ativo')).toBeTruthy();
    expect(screen.getByText('Data da Matrícula')).toBeTruthy();
    expect(screen.getByText(/8\/21\/2025|21\/08\/2025/)).toBeTruthy();
  });

  it('should render fallback texts if fields are null', async () => {
    const nullEnrollment: EnrollmentDetails = {
      ...enrollment,
      studentName: null,
      classRoomName: null,
      status: null,
    };

    await render(DetailsEnrollmentComponent, {
      componentProperties: { enrollment: nullEnrollment },
      imports: [CommonModule],
    });

    expect(screen.getByText('Aluno não informado')).toBeTruthy();
    expect(screen.getByText('Turma não informada')).toBeTruthy();
    expect(screen.getByText('-')).toBeTruthy();
  });

  it('should show loading template when enrollment is null', async () => {
    await render(DetailsEnrollmentComponent, {
      componentProperties: { enrollment: null },
      imports: [CommonModule],
    });

    expect(screen.getByText('Carregando...')).toBeTruthy();
  });
});
