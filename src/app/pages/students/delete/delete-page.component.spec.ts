// src/pages/students/delete/delete-page.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DeleteStudentComponent } from './delete-page.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('DeleteStudentComponent', () => {
  let component: DeleteStudentComponent;
  let fixture: ComponentFixture<DeleteStudentComponent>;
  let routerMock: Partial<Router>;
  let studentServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    studentServiceMock = {
      delete: jasmine.createSpy('delete'),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('42'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, DeleteStudentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: 'StudentService', useValue: studentServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteStudentComponent);
    component = fixture.componentInstance;

    // Forçar o serviço mock interno
    (component as any).studentService = studentServiceMock;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should read ID from route params', () => {
    expect(component.id).toBe('42');
  });

  it('should call studentService.delete and navigate on handleDelete', () => {
    spyOn(window, 'alert'); // para não exibir alert real

    component.handleDelete();

    expect(studentServiceMock.delete).toHaveBeenCalledWith(42);
    expect(window.alert).toHaveBeenCalledWith('Aluno 42 excluído!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should do nothing if id is null on handleDelete', () => {
    component.id = null;
    component.handleDelete();

    expect(studentServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should navigate to /students when cancel is called', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should render ID and buttons correctly', async () => {
    await render(DeleteStudentComponent, {
      imports: [CommonModule],
      providers: [
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '42' } },
          },
        },
        { provide: 'StudentService', useValue: studentServiceMock },
      ],
    });

    expect(screen.getByText(/ID: 42/i)).toBeTruthy();
    expect(screen.getByText('Confirmar Exclusão')).toBeTruthy();
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('should call handleDelete when Confirmar Exclusão button is clicked', () => {
    spyOn(component, 'handleDelete');
    const button = fixture.nativeElement.querySelector('.btnDelete');
    button.click();
    expect(component.handleDelete).toHaveBeenCalled();
  });

  it('should call cancel when Cancelar button is clicked', () => {
    spyOn(component, 'cancel');
    const button = fixture.nativeElement.querySelector('.btnCancel');
    button.click();
    expect(component.cancel).toHaveBeenCalled();
  });
});
