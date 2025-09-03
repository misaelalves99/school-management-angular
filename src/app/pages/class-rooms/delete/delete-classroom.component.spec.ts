// src/pages/class-rooms/delete/delete-classroom.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeleteClassroomComponent } from './delete-classroom.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ClassRoomService } from '../../../services/classroom.service';
import { CommonModule } from '@angular/common';
import { ClassRoom } from '../../../types/classroom.model';

describe('DeleteClassroomComponent', () => {
  let component: DeleteClassroomComponent;
  let fixture: ComponentFixture<DeleteClassroomComponent>;
  let classRoomService: jasmine.SpyObj<ClassRoomService>;
  let router: jasmine.SpyObj<Router>;

  const mockClassRoom: ClassRoom = {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg 08:00-10:00',
    classTeacher: {
      id: 1,
      name: 'Prof. Ana',
      email: 'ana@email.com',
      dateOfBirth: '1980-01-01',
      subject: 'Matemática',
      phone: '123456789',
      address: 'Rua A, 123'
    },
    teachers: [
      {
        id: 2,
        name: 'Prof. João',
        email: 'joao@email.com',
        dateOfBirth: '1982-02-02',
        subject: 'Física',
        phone: '987654321',
        address: 'Rua B, 456'
      }
    ],
    subjects: [
      { id: 1, name: 'Matemática', description: 'Matéria de Matemática', workloadHours: 60 },
      { id: 2, name: 'Física', description: 'Matéria de Física', workloadHours: 50 }
    ]
  };

  beforeEach(async () => {
    const classRoomServiceSpy = jasmine.createSpyObj('ClassRoomService', ['getById', 'delete']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DeleteClassroomComponent],
      providers: [
        { provide: ClassRoomService, useValue: classRoomServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteClassroomComponent);
    component = fixture.componentInstance;
    classRoomService = TestBed.inject(ClassRoomService) as jasmine.SpyObj<ClassRoomService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve carregar a sala pelo id', fakeAsync(() => {
    classRoomService.getById.and.returnValue(of(mockClassRoom));
    component.ngOnInit();
    tick();
    expect(component.classRoom).toEqual(mockClassRoom);
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

  it('getSubjectNames deve retornar nomes separados por vírgula', () => {
    expect(component.getSubjectNames(mockClassRoom.subjects)).toBe('Matemática, Física');
    expect(component.getSubjectNames([])).toBe('Nenhuma');
  });

  it('handleDelete não deve fazer nada se classRoom for null', () => {
    component.classRoom = null;
    component.handleDelete();
    expect(classRoomService.delete).not.toHaveBeenCalled();
  });

  it('handleDelete deve chamar delete, alert e navegar se confirmado', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    component.classRoom = mockClassRoom;

    component.handleDelete();

    expect(classRoomService.delete).toHaveBeenCalledWith(mockClassRoom.id);
    expect(window.alert).toHaveBeenCalledWith('Sala excluída com sucesso!');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });

  it('handleDelete não deve deletar se cancelado', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(window, 'alert');
    component.classRoom = mockClassRoom;

    component.handleDelete();

    expect(classRoomService.delete).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('cancel deve navegar para /classrooms', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });
});
