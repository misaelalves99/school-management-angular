// src/pages/students/details/details-page.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { StudentDetailsComponent } from './details-page.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Student } from '../../../types/student.model';

describe('StudentDetailsComponent', () => {
  let component: StudentDetailsComponent;
  let fixture: ComponentFixture<StudentDetailsComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let studentServiceMock: any;

  const mockStudent: Student = {
    id: 101,
    name: 'João da Silva',
    email: 'joao@email.com',
    dateOfBirth: '2001-09-15',
    enrollmentNumber: '2025001',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123',
  };

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    studentServiceMock = jasmine.createSpyObj('StudentService', ['getById']);
    studentServiceMock.getById.and.returnValue(of(mockStudent));

    const activatedRouteMock = {
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('101') } },
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, StudentDetailsComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: 'StudentService', useValue: studentServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailsComponent);
    component = fixture.componentInstance;

    // Forçar o service mock interno
    (component as any).studentService = studentServiceMock;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should read ID from route params', () => {
    expect(component.id).toBe(101);
  });

  it('should load student on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(studentServiceMock.getById).toHaveBeenCalledWith(101);
    expect(component.student).toEqual(mockStudent);
  }));

  it('should alert and navigate if ID is null', () => {
    spyOn(window, 'alert');
    component.id = null;
    component.ngOnInit();
    expect(window.alert).toHaveBeenCalledWith('ID inválido');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should alert and navigate if student not found', fakeAsync(() => {
    spyOn(window, 'alert');
    studentServiceMock.getById.and.returnValue(of(null));
    component.ngOnInit();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Aluno não encontrado');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  }));

  it('should navigate to edit page when edit() is called', () => {
    component.edit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students/edit/101']);
  });

  it('should navigate back to students list when back() is called', () => {
    component.back();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should render student details in the template', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('João da Silva');
    expect(compiled.textContent).toContain('joao@email.com');
    expect(compiled.textContent).toContain('2001-09-15');
    expect(compiled.textContent).toContain('2025001');
    expect(compiled.textContent).toContain('(11) 99999-9999');
    expect(compiled.textContent).toContain('Rua Exemplo, 123');
  }));

  it('should call edit() when Editar button is clicked', () => {
    spyOn(component, 'edit');
    const button = fixture.nativeElement.querySelector('.btnWarning');
    button.click();
    expect(component.edit).toHaveBeenCalled();
  });

  it('should call back() when Voltar button is clicked', () => {
    spyOn(component, 'back');
    const button = fixture.nativeElement.querySelector('.btnSecondary');
    button.click();
    expect(component.back).toHaveBeenCalled();
  });
});
