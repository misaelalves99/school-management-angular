// src/pages/students/create/create-page.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CreateStudentComponent } from './create-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('CreateStudentComponent', () => {
  let component: CreateStudentComponent;
  let fixture: ComponentFixture<CreateStudentComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let studentServiceMock: any;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    studentServiceMock = jasmine.createSpyObj('StudentService', ['create']);
    studentServiceMock.create.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, CreateStudentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: 'StudentService', useValue: studentServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStudentComponent);
    component = fixture.componentInstance;

    // Forçar o serviço mock interno
    (component as any).studentService = studentServiceMock;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize student with empty fields', () => {
    expect(component.student).toEqual({
      name: '',
      email: '',
      dateOfBirth: '',
      enrollmentNumber: '',
      phone: '',
      address: '',
    });
  });

  it('should validate required fields', () => {
    const isValid = component.validate();
    expect(isValid).toBeFalse();
    expect(component.errors.name).toBe('Nome é obrigatório.');
    expect(component.errors.email).toBe('Email é obrigatório.');
    expect(component.errors.dateOfBirth).toBe('Data de nascimento é obrigatória.');
    expect(component.errors.enrollmentNumber).toBe('Matrícula é obrigatória.');
  });

  it('should call studentService.create and navigate on successful submit', fakeAsync(() => {
    component.student = {
      name: 'Teste',
      email: 'teste@email.com',
      dateOfBirth: '2000-01-01',
      enrollmentNumber: '123',
      phone: '999999999',
      address: 'Rua Teste',
    };

    component.onSubmit({} as NgForm);
    tick();

    expect(studentServiceMock.create).toHaveBeenCalledWith(component.student);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  }));

  it('should not call studentService.create if validation fails', () => {
    component.student.name = '';
    component.onSubmit({} as NgForm);

    expect(studentServiceMock.create).not.toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should render form inputs and buttons', async () => {
    await render(CreateStudentComponent, { imports: [CommonModule, FormsModule] });

    expect(screen.getByLabelText('Nome')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Data de Nascimento')).toBeTruthy();
    expect(screen.getByLabelText('Matrícula')).toBeTruthy();
    expect(screen.getByLabelText('Telefone')).toBeTruthy();
    expect(screen.getByLabelText('Endereço')).toBeTruthy();

    expect(screen.getByText('Salvar')).toBeTruthy();
    expect(screen.getByText('Voltar')).toBeTruthy();
  });

  it('should display validation errors in template', () => {
    component.validate();
    fixture.detectChanges();

    const nameError = fixture.nativeElement.querySelector('#name + .formError');
    const emailError = fixture.nativeElement.querySelector('#email + .formError');
    const dobError = fixture.nativeElement.querySelector('#dateOfBirth + .formError');
    const enrollmentError = fixture.nativeElement.querySelector('#enrollmentNumber + .formError');

    expect(nameError.textContent).toContain('Nome é obrigatório.');
    expect(emailError.textContent).toContain('Email é obrigatório.');
    expect(dobError.textContent).toContain('Data de nascimento é obrigatória.');
    expect(enrollmentError.textContent).toContain('Matrícula é obrigatória.');
  });

  it('should update inputs via ngModel', async () => {
    await render(CreateStudentComponent, { imports: [CommonModule, FormsModule] });

    const nameInput = screen.getByLabelText('Nome') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const dobInput = screen.getByLabelText('Data de Nascimento') as HTMLInputElement;
    const enrollmentInput = screen.getByLabelText('Matrícula') as HTMLInputElement;

    fireEvent.input(nameInput, { target: { value: 'Novo Nome' } });
    fireEvent.input(emailInput, { target: { value: 'novo@email.com' } });
    fireEvent.input(dobInput, { target: { value: '2001-02-02' } });
    fireEvent.input(enrollmentInput, { target: { value: '456' } });

    expect(nameInput.value).toBe('Novo Nome');
    expect(emailInput.value).toBe('novo@email.com');
    expect(dobInput.value).toBe('2001-02-02');
    expect(enrollmentInput.value).toBe('456');
  });
});
