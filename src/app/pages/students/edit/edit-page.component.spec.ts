// src/pages/students/edit/edit-page.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditStudentComponent } from './edit-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap } from '@angular/router';
import { render, screen } from '@testing-library/angular';

describe('EditStudentComponent', () => {
  let component: EditStudentComponent;
  let fixture: ComponentFixture<EditStudentComponent>;
  let routerMock: Partial<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    // Mock completo de ActivatedRouteSnapshot
    const mockSnapshot: ActivatedRouteSnapshot = {
      paramMap: convertToParamMap({ id: '1' }),
      queryParamMap: convertToParamMap({}),
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: {},
      title: '',
      outlet: 'primary',
      component: EditStudentComponent,
      routeConfig: null,
      root: null!,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      toString: () => '',
    };

    activatedRouteMock = {
      snapshot: mockSnapshot,
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, EditStudentComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
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
    expect(component.id).toBe('1');
  });

  it('should load the student data into formData', () => {
    expect(component.formData.name).toBe('João Silva');
    expect(component.formData.email).toBe('joao@example.com');
  });

  it('should navigate back when cancel() is called', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should navigate back after handleSubmit() is called', () => {
    spyOn(window, 'alert');
    component.handleSubmit();
    expect(window.alert).toHaveBeenCalledWith('Aluno atualizado!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should render form fields with student data', async () => {
    await render(EditStudentComponent, {
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
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
