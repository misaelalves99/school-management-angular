// src/pages/enrollments/edit/edit-enrollment.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { render, screen, fireEvent } from '@testing-library/angular';
import { of } from 'rxjs'; // <-- IMPORTAR of
import { EditEnrollmentComponent } from './edit-enrollment.component';
import { EnrollmentService, Enrollment } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';

describe('EditEnrollmentComponent', () => {
  let component: EditEnrollmentComponent;
  let fixture: ComponentFixture<EditEnrollmentComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let enrollmentServiceMock: jasmine.SpyObj<EnrollmentService>;
  let studentServiceMock: jasmine.SpyObj<StudentService>;
  let classRoomServiceMock: jasmine.SpyObj<ClassRoomService>;

  const enrollmentData: Enrollment = {
    id: 1,
    studentId: 1,
    classRoomId: 2,
    enrollmentDate: '2025-08-21',
    status: 'Ativo',
  };

  const studentsMock: Student[] = [
    { id: 1, name: 'Aluno A', email: 'a@email.com', dateOfBirth: '2005-01-01', enrollmentNumber: 'EN001', phone: '123', address: 'Rua A, 1' },
    { id: 2, name: 'Aluno B', email: 'b@email.com', dateOfBirth: '2005-02-01', enrollmentNumber: 'EN002', phone: '456', address: 'Rua B, 2' },
  ];

  const classRoomsMock: ClassRoom[] = [
    { id: 1, name: 'Sala A', capacity: 30, schedule: 'Seg 08:00-10:00', subjects: [], teachers: [], classTeacher: undefined },
    { id: 2, name: 'Sala B', capacity: 25, schedule: 'Ter 10:00-12:00', subjects: [], teachers: [], classTeacher: undefined },
  ];

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    enrollmentServiceMock = jasmine.createSpyObj('EnrollmentService', ['getById', 'update']);
    studentServiceMock = jasmine.createSpyObj('StudentService', ['getAll']);
    classRoomServiceMock = jasmine.createSpyObj('ClassRoomService', ['getAll']);

    enrollmentServiceMock.getById.and.returnValue(of(enrollmentData));
    enrollmentServiceMock.update.and.returnValue(of(null));
    studentServiceMock.getAll.and.returnValue(of(studentsMock));
    classRoomServiceMock.getAll.and.returnValue(of(classRoomsMock));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, EditEnrollmentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: EnrollmentService, useValue: enrollmentServiceMock },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: ClassRoomService, useValue: classRoomServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEnrollmentComponent);
    component = fixture.componentInstance;
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

  it('should call update and navigate if form is valid', fakeAsync(() => {
    component.formData = { ...enrollmentData };
    component.handleSubmit();
    tick();

    expect(enrollmentServiceMock.update).toHaveBeenCalledWith(enrollmentData);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('should update form inputs via ngModel', async () => {
    await render(EditEnrollmentComponent, {
      componentProperties: { formData: { ...enrollmentData } },
      imports: [FormsModule, CommonModule],
    });

    const studentSelect = screen.getByLabelText('Aluno') as HTMLSelectElement;
    const classSelect = screen.getByLabelText('Turma') as HTMLSelectElement;
    const dateInput = screen.getByLabelText('Data da Matrícula') as HTMLInputElement;
    const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;

    fireEvent.change(studentSelect, { target: { value: '2' } });
    fireEvent.change(classSelect, { target: { value: '1' } });
    fireEvent.change(dateInput, { target: { value: '2025-08-22' } });
    fireEvent.change(statusSelect, { target: { value: 'Inativo' } });

    expect(studentSelect.value).toBe('2');
    expect(classSelect.value).toBe('1');
    expect(dateInput.value).toBe('2025-08-22');
    expect(statusSelect.value).toBe('Inativo');
  });

  it('should initialize formData with enrollment from service on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.formData).toEqual(enrollmentData);
    expect(component.students).toEqual(studentsMock);
    expect(component.classRooms).toEqual(classRoomsMock);
  }));
});
