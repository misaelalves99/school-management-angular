// src/pages/enrollments/delete/delete-enrollment.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DeleteEnrollmentComponent } from './delete-enrollment.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { EnrollmentService, Enrollment } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';

describe('DeleteEnrollmentComponent', () => {
  let component: DeleteEnrollmentComponent;
  let fixture: ComponentFixture<DeleteEnrollmentComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let enrollmentServiceMock: jasmine.SpyObj<EnrollmentService>;
  let studentServiceMock: jasmine.SpyObj<StudentService>;
  let classRoomServiceMock: jasmine.SpyObj<ClassRoomService>;

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
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    enrollmentServiceMock = jasmine.createSpyObj('EnrollmentService', ['getById', 'delete']);
    studentServiceMock = jasmine.createSpyObj('StudentService', ['getById']);
    classRoomServiceMock = jasmine.createSpyObj('ClassRoomService', ['getById']);

    // ✅ Correto: delete retorna Observable<void>
    enrollmentServiceMock.delete.and.returnValue(of(void 0));

    // ✅ Correto: getById retorna Observable<Enrollment | undefined>
    enrollmentServiceMock.getById.and.returnValue(of(enrollment));

    studentServiceMock.getById.and.returnValue(of(student));
    classRoomServiceMock.getById.and.returnValue(of(classRoom));

    await TestBed.configureTestingModule({
      imports: [CommonModule, DeleteEnrollmentComponent],
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
    expect(enrollmentServiceMock.getById).toHaveBeenCalledWith(1);
    expect(studentServiceMock.getById).toHaveBeenCalledWith(enrollment.studentId);
    expect(classRoomServiceMock.getById).toHaveBeenCalledWith(enrollment.classRoomId);
    expect(component.enrollment).toEqual(enrollment);
    expect(component.student).toEqual(student);
    expect(component.classRoom).toEqual(classRoom);
  }));

  it('ngOnInit deve redirecionar se ID inválido', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap = new Map(); // id ausente

    spyOn(window, 'alert');

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('ID inválido');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('ngOnInit deve redirecionar se matrícula não encontrada', fakeAsync(() => {
    enrollmentServiceMock.getById.and.returnValue(of(undefined));
    spyOn(window, 'alert');

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Matrícula não encontrada');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('ngOnInit deve redirecionar em caso de erro no serviço', fakeAsync(() => {
    enrollmentServiceMock.getById.and.returnValue(throwError(() => new Error('Erro')));
    spyOn(window, 'alert');

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Erro ao carregar matrícula.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('handleDelete deve chamar delete e navegar se confirmado', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component.enrollment = enrollment;
    component.student = student;

    component.handleDelete();
    tick();

    expect(enrollmentServiceMock.delete).toHaveBeenCalledWith(enrollment.id);
    expect(window.alert).toHaveBeenCalledWith(`Matrícula do aluno ${student.name} excluída com sucesso!`);
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
