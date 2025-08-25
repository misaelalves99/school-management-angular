// src/pages/class-rooms/create/create-classroom.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateClassroomComponent } from './create-classroom.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassRoomService } from '../../../services/classroom.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateClassroomComponent', () => {
  let component: CreateClassroomComponent;
  let fixture: ComponentFixture<CreateClassroomComponent>;
  let classRoomService: jasmine.SpyObj<ClassRoomService>;
  let router: Router;

  beforeEach(async () => {
    const classRoomServiceSpy = jasmine.createSpyObj('ClassRoomService', ['add']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [CreateClassroomComponent],
      providers: [{ provide: ClassRoomService, useValue: classRoomServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClassroomComponent);
    component = fixture.componentInstance;
    classRoomService = TestBed.inject(ClassRoomService) as jasmine.SpyObj<ClassRoomService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('não deve chamar service se campos estiverem vazios', () => {
    component.name = '';
    component.capacity = null;
    component.schedule = '';
    component.handleSubmit();
    expect(classRoomService.add).not.toHaveBeenCalled();
  });

  it('deve chamar service e navegar ao submeter formulário', () => {
    spyOn(router, 'navigate');

    component.name = 'Sala A';
    component.capacity = 30;
    component.schedule = 'Seg 08:00-10:00';

    component.handleSubmit();

    expect(classRoomService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Sala A',
      capacity: 30,
      schedule: 'Seg 08:00-10:00'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });

  it('deve navegar ao cancelar', () => {
    spyOn(router, 'navigate');
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });
});
