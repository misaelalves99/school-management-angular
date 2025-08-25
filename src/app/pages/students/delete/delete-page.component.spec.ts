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

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should read ID from route params', () => {
    expect(component.id).toBe('42');
  });

  it('should navigate to /students when handleDelete is called', () => {
    spyOn(window, 'alert'); // para não exibir o alert real
    component.handleDelete();
    expect(window.alert).toHaveBeenCalledWith('Aluno 42 excluído!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should navigate to /students when cancel is called', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should render ID in template', async () => {
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
