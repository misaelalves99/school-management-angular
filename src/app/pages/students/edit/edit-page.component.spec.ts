// src/pages/students/edit/edit-page.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditStudentComponent } from './edit-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { StudentService } from '../../../services/student.service';

describe('EditStudentComponent', () => {
  let component: EditStudentComponent;
  let fixture: ComponentFixture<EditStudentComponent>;
  let routerMock: Partial<Router>;
  let studentServiceMock: Partial<StudentService>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  const mockStudent = {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    dateOfBirth: '2000-01-01',
    enrollmentNumber: '20230001',
    phone: '123456789',
    address: 'Rua A',
  };

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    studentServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(of(mockStudent)),
      update: jasmine.createSpy('update').and.returnValue(of(true)),
    };
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'id') return '1';
            return null;
          }
        }
      } as any 
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, EditStudentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: StudentService, useValue: studentServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should read ID from route params', () => {
    expect(component.id).toBe(1);
  });

  it('should load student data into formData', () => {
    expect(component.formData.name).toBe('João Silva');
    expect(component.formData.email).toBe('joao@example.com');
    expect(component.formData.dateOfBirth).toBe('2000-01-01');
    expect(component.formData.enrollmentNumber).toBe('20230001');
    expect(component.formData.phone).toBe('123456789');
    expect(component.formData.address).toBe('Rua A');
  });

  it('should validate required fields', () => {
    component.formData.name = '';
    component.formData.email = '';
    component.formData.dateOfBirth = '';
    component.formData.enrollmentNumber = '';

    const valid = (component as any).validate();
    expect(valid).toBeFalse();
    expect(component.errors.name).toBe('Nome é obrigatório.');
    expect(component.errors.email).toBe('Email é obrigatório.');
    expect(component.errors.dateOfBirth).toBe('Data de nascimento é obrigatória.');
    expect(component.errors.enrollmentNumber).toBe('Matrícula é obrigatória.');
  });

  it('should show email format validation', () => {
    component.formData.email = 'invalid-email';
    const valid = (component as any).validate();
    expect(valid).toBeFalse();
    expect(component.errors.email).toBe('Email inválido.');
  });

  it('should navigate back when cancel() is called', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should update student and navigate after handleSubmit()', () => {
    spyOn(window, 'alert');
    component.handleSubmit();
    expect(studentServiceMock.update).toHaveBeenCalledWith(1, component.formData);
    expect(window.alert).toHaveBeenCalledWith('Aluno atualizado com sucesso!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should alert and not navigate if student not found during update', () => {
    spyOn(window, 'alert');
    (studentServiceMock.update as jasmine.Spy).and.returnValue(of(false));
    component.handleSubmit();
    expect(window.alert).toHaveBeenCalledWith('Falha ao atualizar: aluno não encontrado.');
  });

  it('should render form fields with student data', async () => {
    await render(EditStudentComponent, {
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: StudentService, useValue: studentServiceMock },
      ],
    });

    expect(screen.getByDisplayValue('João Silva')).toBeTruthy();
    expect(screen.getByDisplayValue('joao@example.com')).toBeTruthy();
    expect(screen.getByDisplayValue('2000-01-01')).toBeTruthy();
    expect(screen.getByDisplayValue('20230001')).toBeTruthy();
    expect(screen.getByDisplayValue('123456789')).toBeTruthy();
    expect(screen.getByDisplayValue('Rua A')).toBeTruthy();
  });

  it('should call cancel() when Voltar button is clicked', () => {
    spyOn(component, 'cancel');
    const button = fixture.nativeElement.querySelector('.btnSecondary');
    button.click();
    expect(component.cancel).toHaveBeenCalled();
  });

  it('should call handleSubmit() when Salvar button is clicked', () => {
    spyOn(component, 'handleSubmit');
    const button = fixture.nativeElement.querySelector('.btnPrimary');
    button.click();
    expect(component.handleSubmit).toHaveBeenCalled();
  });
});
