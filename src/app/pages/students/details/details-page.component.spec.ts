// src/pages/students/details/details-page.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { StudentDetailsComponent } from './details-page.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('StudentDetailsComponent', () => {
  let component: StudentDetailsComponent;
  let fixture: ComponentFixture<StudentDetailsComponent>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('101'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, StudentDetailsComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should read ID from route params', () => {
    expect(component.id).toBe('101');
  });

  it('should navigate to edit page when edit() is called', () => {
    component.edit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students/edit/101']);
  });

  it('should navigate back to students list when back() is called', () => {
    component.back();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should render student details in the template', async () => {
    await render(StudentDetailsComponent, {
      imports: [CommonModule],
      providers: [
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '101' } },
          },
        },
      ],
    });

    expect(screen.getByText(/João da Silva/i)).toBeTruthy();
    expect(screen.getByText(/joao@email.com/i)).toBeTruthy();
    expect(screen.getByText(/2001-09-15/i)).toBeTruthy();
    expect(screen.getByText(/2025001/i)).toBeTruthy();
    expect(screen.getByText(/\(11\) 99999-9999/i)).toBeTruthy();
    expect(screen.getByText(/Rua Exemplo, 123/i)).toBeTruthy();
  });

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
