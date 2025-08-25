// src/pages/enrollments/enrollment-index.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { EnrollmentIndexComponent } from './enrollment-index.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('EnrollmentIndexComponent', () => {
  let component: EnrollmentIndexComponent;
  let fixture: ComponentFixture<EnrollmentIndexComponent>;
  let routerMock: Partial<Router>;

  const mockStudents = [
    { id: 1, name: 'Aluno A' },
    { id: 2, name: 'Aluno B' },
  ];

  const mockClassRooms = [
    { id: 1, name: 'Sala A' },
    { id: 2, name: 'Sala B' },
  ];

  const mockEnrollments = [
    { id: 1, studentId: 1, classRoomId: 1, status: 'Ativo', enrollmentDate: '2025-08-21' },
    { id: 2, studentId: 2, classRoomId: 2, status: 'Inativo', enrollmentDate: '2025-08-20' },
    { id: 3, studentId: 1, classRoomId: 2, status: 'Ativo', enrollmentDate: '2025-08-19' },
  ];

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };

    const enrollmentServiceMock = { getAll: jasmine.createSpy('getAll').and.returnValue(of(mockEnrollments)) };
    const studentServiceMock = { getAll: jasmine.createSpy('getAll').and.returnValue(of(mockStudents)) };
    const classRoomServiceMock = { getAll: jasmine.createSpy('getAll').and.returnValue(of(mockClassRooms)) };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, EnrollmentIndexComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: 'EnrollmentService', useValue: enrollmentServiceMock },
        { provide: 'StudentService', useValue: studentServiceMock },
        { provide: 'ClassRoomService', useValue: classRoomServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentIndexComponent);
    component = fixture.componentInstance;

    // Forçar os serviços mocks internos
    (component as any).enrollmentService = enrollmentServiceMock;
    (component as any).studentService = studentServiceMock;
    (component as any).classRoomService = classRoomServiceMock;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load students, classrooms, and enrollments on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.students.length).toBe(2);
    expect(component.classRooms.length).toBe(2);
    expect(component.enrollments.length).toBe(3);
    expect(component.data.items.length).toBe(2); // PAGE_SIZE = 2
  }));

  it('should get student and classroom names', () => {
    expect(component.getStudentName(1)).toBe('Aluno A');
    expect(component.getStudentName(999)).toBe('Aluno não informado');

    expect(component.getClassRoomName(2)).toBe('Sala B');
    expect(component.getClassRoomName(999)).toBe('Turma não informada');
  });

  it('should paginate correctly', () => {
    component.currentPage = 2;
    component.loadData();

    expect(component.data.items.length).toBe(1);
    expect(component.totalPages).toBe(2);
  });

  it('should filter by search string', () => {
    component.searchString = 'ativo';
    component.loadData();

    expect(component.data.totalItems).toBe(2); // Apenas status 'Ativo'
    expect(component.data.items.length).toBe(2); // PAGE_SIZE = 2
  });

  it('should reset page to 1 on search', () => {
    component.currentPage = 2;
    component.searchString = 'Inativo';
    component.search();
    expect(component.currentPage).toBe(1);
  });

  it('should go to specific page', () => {
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
  });

  it('should render enrollment table correctly', async () => {
    await render(EnrollmentIndexComponent, {
      imports: [CommonModule, FormsModule],
      componentProperties: {},
    });

    // Podemos checar a existência do header
    expect(screen.getByText('Aluno')).toBeTruthy();
    expect(screen.getByText('Turma')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Data da Matrícula')).toBeTruthy();
  });
});
