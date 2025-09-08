// src/pages/enrollments/details/details-enrollment.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DetailsEnrollmentComponent, EnrollmentDetails } from './details-enrollment.component';
import { Enrollment } from '../../../services/enrollment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EnrollmentService } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';

describe('DetailsEnrollmentComponent', () => {
  let component: DetailsEnrollmentComponent;
  let fixture: ComponentFixture<DetailsEnrollmentComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let enrollmentServiceMock: jasmine.SpyObj<EnrollmentService>;
  let studentServiceMock: jasmine.SpyObj<StudentService>;
  let classRoomServiceMock: jasmine.SpyObj<ClassRoomService>;

  const enrollmentData = {
    id: 1,
    studentId: 1,
    classRoomId: 1,
    enrollmentDate: '2025-08-21',
    status: 'Ativo',
  };

  const studentName = 'Aluno A';
  const classRoomName = 'Sala A';

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    enrollmentServiceMock = jasmine.createSpyObj('EnrollmentService', ['getById']);
    studentServiceMock = jasmine.createSpyObj('StudentService', ['getById']);
    classRoomServiceMock = jasmine.createSpyObj('ClassRoomService', ['getById']);

    const enrollmentData: Enrollment = {
      id: 1,
      studentId: 1,
      classRoomId: 1,
      enrollmentDate: '2025-08-21',
      status: 'Ativo', // agora compatível com "Ativo" | "Inativo"
    };

    const studentName = 'Aluno A';
    const classRoomName = 'Sala A';

    enrollmentServiceMock.getById.and.returnValue(of(enrollmentData));
    studentServiceMock.getById.and.returnValue(of({ id: 1, name: studentName } as any));
    classRoomServiceMock.getById.and.returnValue(of({ id: 1, name: classRoomName } as any));

    await TestBed.configureTestingModule({
      imports: [CommonModule, DetailsEnrollmentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: EnrollmentService, useValue: enrollmentServiceMock },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: ClassRoomService, useValue: classRoomServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } }, // mock do param
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsEnrollmentComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve carregar enrollment, student e classRoom', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(enrollmentServiceMock.getById).toHaveBeenCalledWith(1);
    expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
    expect(classRoomServiceMock.getById).toHaveBeenCalledWith(1);

    expect(component.enrollment).toEqual({
      id: 1,
      studentName,
      classRoomName,
      status: 'Ativo',
      enrollmentDate: '2025-08-21',
    });
  }));

  it('ngOnInit deve alertar e navegar se id inválido', () => {
    spyOn(window, 'alert');
    spyOn(component['route'].snapshot.paramMap, 'get').and.returnValue(null);

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('ID inválido');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('ngOnInit deve alertar e navegar se matrícula não encontrada', fakeAsync(() => {
    spyOn(window, 'alert');
    enrollmentServiceMock.getById.and.returnValue(of(undefined));

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Matrícula não encontrada');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  }));

  it('edit() deve navegar para página de edição', () => {
    component.enrollment = { id: 1 } as any;
    component.edit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments/edit/1']);
  });

  it('back() deve navegar para /enrollments', () => {
    component.back();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/enrollments']);
  });

  it('deve exibir fallback texts se nomes/status forem nulos', async () => {
    component.enrollment = {
      id: 1,
      studentName: null,
      classRoomName: null,
      status: null,
      enrollmentDate: '2025-08-21',
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Aluno não informado');
    expect(compiled.textContent).toContain('Turma não informada');
    expect(compiled.textContent).toContain('-');
  });

  it('deve exibir loading template quando enrollment for null', () => {
    component.enrollment = null;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Carregando...');
  });
});
