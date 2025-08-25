// src/pages/students/create/create-page.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateStudentComponent } from './create-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('CreateStudentComponent', () => {
  let component: CreateStudentComponent;
  let fixture: ComponentFixture<CreateStudentComponent>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, CreateStudentComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize student with empty fields', () => {
    expect(component.student.name).toBe('');
    expect(component.student.email).toBe('');
    expect(component.student.dateOfBirth).toBe('');
    expect(component.student.enrollmentNumber).toBe('');
    expect(component.student.phone).toBe('');
    expect(component.student.address).toBe('');
  });

  it('should validate required fields', () => {
    const isValid = component.validate();
    expect(isValid).toBeFalse();
    expect(component.errors.name).toBe('Nome é obrigatório.');
    expect(component.errors.email).toBe('Email é obrigatório.');
    expect(component.errors.dateOfBirth).toBe('Data de nascimento é obrigatória.');
    expect(component.errors.enrollmentNumber).toBe('Matrícula é obrigatória.');
  });

  it('should navigate to /students on successful submit', () => {
    component.student = {
      name: 'Teste',
      email: 'teste@email.com',
      dateOfBirth: '2000-01-01',
      enrollmentNumber: '123',
      phone: '999999999',
      address: 'Rua Teste',
    };

    component.onSubmit({} as any);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
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
    expect(screen.getByText('Voltar à Lista')).toBeTruthy();
  });

  it('should show validation errors in template', async () => {
    component.validate();
    fixture.detectChanges();

    const nameError = fixture.nativeElement.querySelector('.textDanger');
    expect(nameError.textContent).toContain('Nome é obrigatório.');
  });
});
