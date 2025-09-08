// src/pages/class-rooms/create/create-classroom.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateClassroomComponent } from './create-classroom.component';
import { ClassRoomService } from '../../../services/classroom.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CreateClassroomComponent', () => {
  let component: CreateClassroomComponent;
  let fixture: ComponentFixture<CreateClassroomComponent>;
  let classRoomServiceSpy: jasmine.SpyObj<ClassRoomService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    classRoomServiceSpy = jasmine.createSpyObj('ClassRoomService', ['add']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CreateClassroomComponent],
      providers: [
        { provide: ClassRoomService, useValue: classRoomServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar inputs e botões', () => {
    const nameInput: DebugElement = fixture.debugElement.query(By.css('#name'));
    const capacityInput: DebugElement = fixture.debugElement.query(By.css('#capacity'));
    const scheduleInput: DebugElement = fixture.debugElement.query(By.css('#schedule'));
    const submitBtn: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    const cancelBtn: DebugElement = fixture.debugElement.query(By.css('button.btnSecondary'));

    expect(nameInput).toBeTruthy();
    expect(capacityInput).toBeTruthy();
    expect(scheduleInput).toBeTruthy();
    expect(submitBtn).toBeTruthy();
    expect(cancelBtn).toBeTruthy();
  });

  it('deve atualizar propriedades do componente via ngModel', () => {
    const nameInput: HTMLInputElement = fixture.debugElement.query(By.css('#name')).nativeElement;
    const capacityInput: HTMLInputElement = fixture.debugElement.query(By.css('#capacity')).nativeElement;
    const scheduleInput: HTMLInputElement = fixture.debugElement.query(By.css('#schedule')).nativeElement;

    nameInput.value = 'Sala X';
    nameInput.dispatchEvent(new Event('input'));

    capacityInput.value = '25';
    capacityInput.dispatchEvent(new Event('input'));

    scheduleInput.value = 'Seg 08:00';
    scheduleInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.name).toBe('Sala X');
    expect(component.capacity).toBe(25);
    expect(component.schedule).toBe('Seg 08:00');
  });

  it('não deve chamar service se algum campo estiver vazio', () => {
    component.name = '';
    component.capacity = null;
    component.schedule = '';
    component.handleSubmit();
    expect(classRoomServiceSpy.add).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve chamar service e navegar ao submeter formulário válido', () => {
    component.name = 'Sala Y';
    component.capacity = 30;
    component.schedule = 'Ter 10:00';

    component.handleSubmit();

    expect(classRoomServiceSpy.add).toHaveBeenCalledWith({
      name: 'Sala Y',
      capacity: 30,
      schedule: 'Ter 10:00',
      subjects: [],
      teachers: [],
      classTeacher: undefined,
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/classrooms']);
  });

  it('deve navegar ao clicar no botão cancelar', () => {
    component.cancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/classrooms']);
  });
});
