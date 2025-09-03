// src/pages/class-rooms/edit/edit-classroom.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditClassroomComponent } from './edit-classroom.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ClassRoomService } from '../../../services/classroom.service';
import { ClassRoom } from '../../../types/classroom.model';
import { CommonModule } from '@angular/common';

describe('EditClassroomComponent', () => {
  let component: EditClassroomComponent;
  let fixture: ComponentFixture<EditClassroomComponent>;
  let classRoomService: jasmine.SpyObj<ClassRoomService>;
  let router: jasmine.SpyObj<Router>;

  const mockClassRoom: ClassRoom = {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg 08:00-10:00',
    subjects: [],
    teachers: [],
    classTeacher: undefined
  };

  beforeEach(async () => {
    const classRoomServiceSpy = jasmine.createSpyObj('ClassRoomService', ['getById', 'update']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [EditClassroomComponent],
      providers: [
        { provide: ClassRoomService, useValue: classRoomServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditClassroomComponent);
    component = fixture.componentInstance;
    classRoomService = TestBed.inject(ClassRoomService) as jasmine.SpyObj<ClassRoomService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve carregar a sala corretamente', fakeAsync(() => {
    classRoomService.getById.and.returnValue(of(mockClassRoom));
    component.ngOnInit();
    tick();
    expect(component.classRoom).toEqual(mockClassRoom);
    expect(component.formData).toEqual(mockClassRoom);
  }));

  it('ngOnInit deve alertar e navegar se id inválido', () => {
    spyOn(window, 'alert');
    const routeSpy = TestBed.inject(ActivatedRoute);
    (routeSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('ID inválido');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });

  it('ngOnInit deve alertar e navegar se sala não encontrada', fakeAsync(() => {
    spyOn(window, 'alert');
    // Corrigido: usar undefined em vez de null
    classRoomService.getById.and.returnValue(of(undefined));

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Sala não encontrada.');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  }));

  it('ngOnInit deve alertar e navegar em caso de erro do service', fakeAsync(() => {
    spyOn(window, 'alert');
    classRoomService.getById.and.returnValue(throwError(() => new Error('Erro')));

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Erro ao carregar a sala.');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  }));

  it('handleSubmit deve atualizar a sala, alertar e navegar', () => {
    spyOn(window, 'alert');
    component.classRoom = mockClassRoom;
    component.formData = { name: 'Sala B', capacity: 50 };

    component.handleSubmit();

    expect(classRoomService.update).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1,
      name: 'Sala B',
      capacity: 50
    }));
    expect(window.alert).toHaveBeenCalledWith('Sala atualizada com sucesso!');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });

  it('handleSubmit não deve chamar update se classRoom for null', () => {
    component.classRoom = null;
    spyOn(classRoomService, 'update');

    component.handleSubmit();

    expect(classRoomService.update).not.toHaveBeenCalled();
  });

  it('cancel deve navegar para /classrooms', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });
});
