import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DeleteEnrollmentComponent } from './delete-enrollment.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { EnrollmentService } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';
import { Enrollment } from '../../../services/enrollment.service';

describe('DeleteEnrollmentComponent', () => {
  let component: DeleteEnrollmentComponent;
  let fixture: ComponentFixture<DeleteEnrollmentComponent>;
  let routerMock: Partial<Router>;
  let enrollmentServiceMock: Partial<EnrollmentService>;
  let studentServiceMock: Partial<StudentService>;
  let classRoomServiceMock: Partial<ClassRoomService>;

  const enrollment: Enrollment = {
    id: 1,
    studentId: 1,
    classRoomId: 1,
    enrollmentDate: '2025-08-21',
    status: 'Ativo',
  };

  const student: Student = {
    id: 1,
    name: 'Aluno A',
    email: 'a@email.com',
    dateOfBirth: '2005-01-01',
    enrollmentNumber: 'EN001',
    phone: '123456789',
    address: 'Rua A, 123',
  };

  const classRoom: ClassRoom = {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg 08:00-10:00',
    subjects: [],
    teachers: [],
    classTeacher: undefined,
  };

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    enrollmentServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(of(enrollment)),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
    };
    studentServiceMock = { getById: jasmine.createSpy('getById').and.returnValue(of(student)) };
    classRoomServiceMock = { getById: jasmine.createSpy('getById').and.returnValue(of(classRoom)) };

    await TestBed.configureTestingModule({
      imports: [CommonModule, DeleteEnrollmentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: EnrollmentService, useValue: enrollmentServiceMock },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: ClassRoomService, useValue: classRoomServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve carregar matrícula, aluno e turma', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(enrollmentServiceMock.getById).toHaveBeenCalled();
    expect(studentServiceMock.getById).toHaveBeenCalledWith(enrollment.studentId);
    expect(classRoomServiceMock.getById).toHaveBeenCalledWith(enrollment.classRoomId);
    expect(component.enrollment).toEqual(enrollment);
    expect(component.student).toEqual(student);
    expect(component.classRoom).toEqual(classRoom);
  }));

  it('handleDelete deve chamar delete e navegar se confirmado', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component.enrollment = enrollment;
    component.student = student;

    component.handleDelete();
    tick();

    expect(enrollmentServiceMock.delete).toHaveBeenCalledWith(enrollment.id);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('handleDelete não deve excluir se cancelado', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.enrollment = enrollment;
    component.student = student;

    component.handleDelete();

    expect(enrollmentServiceMock.delete).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('cancel deve navegar para /enrollments', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });
});
