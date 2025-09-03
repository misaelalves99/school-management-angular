// src/pages/class-rooms/details/details-classroom.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DetailsClassroomComponent } from './details-classroom.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ClassRoomService } from '../../../services/classroom.service';
import { By } from '@angular/platform-browser';
import { ClassRoom } from '../../../types/classroom.model';

describe('DetailsClassroomComponent', () => {
  let component: DetailsClassroomComponent;
  let fixture: ComponentFixture<DetailsClassroomComponent>;
  let classRoomService: jasmine.SpyObj<ClassRoomService>;
  let router: jasmine.SpyObj<Router>;

  const mockClassRoom: ClassRoom = {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg 08:00-10:00',
    subjects: [
      { id: 1, name: 'Matemática', description: 'Matéria de Matemática', workloadHours: 60 },
      { id: 2, name: 'Física', description: 'Matéria de Física', workloadHours: 50 }
    ],
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
    classTeacher: {
      id: 1,
      name: 'Prof. Ana',
      email: 'ana@email.com',
      dateOfBirth: '1980-01-01',
      subject: 'Matemática',
      phone: '123456789',
      address: 'Rua A, 123'
    }
  };

  beforeEach(async () => {
    const classRoomServiceSpy = jasmine.createSpyObj('ClassRoomService', ['getById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [DetailsClassroomComponent],
      providers: [
        { provide: ClassRoomService, useValue: classRoomServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsClassroomComponent);
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
  }));

  it('ngOnInit deve alertar e navegar se id inválido', () => {
    spyOn(window, 'alert');
    const routeSpy = TestBed.inject(ActivatedRoute);
    (routeSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('ID da sala inválido');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });

  it('ngOnInit deve alertar e navegar se sala não encontrada', fakeAsync(() => {
    spyOn(window, 'alert');
    // Corrigido: usar undefined em vez de null
    classRoomService.getById.and.returnValue(of(undefined));

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Sala não encontrada');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  }));

  it('ngOnInit deve alertar e navegar em caso de erro do service', fakeAsync(() => {
    spyOn(window, 'alert');
    classRoomService.getById.and.returnValue(throwError(() => new Error('Erro')));

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Sala não encontrada');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  }));

  it('deve renderizar dados da turma corretamente', () => {
    component.classRoom = mockClassRoom;
    fixture.detectChanges();

    const nameEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(1) .detailsValue')).nativeElement;
    expect(nameEl.textContent).toContain('Sala A');

    const capacityEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(2) .detailsValue')).nativeElement;
    expect(capacityEl.textContent).toContain('30');

    const scheduleEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(3) .detailsValue')).nativeElement;
    expect(scheduleEl.textContent).toContain('Seg 08:00-10:00');

    const subjectEls = fixture.debugElement.queryAll(By.css('.detailsRow:nth-child(4) li'));
    expect(subjectEls.length).toBe(2);
    expect(subjectEls[0].nativeElement.textContent).toBe('Matemática');
    expect(subjectEls[1].nativeElement.textContent).toBe('Física');

    const teacherEls = fixture.debugElement.queryAll(By.css('.detailsRow:nth-child(5) li'));
    expect(teacherEls.length).toBe(1);
    expect(teacherEls[0].nativeElement.textContent).toBe('Prof. João');

    const classTeacherEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(6) .detailsValue')).nativeElement;
    expect(classTeacherEl.textContent).toContain('Prof. Ana');
  });

  it('deve mostrar mensagens alternativas se não houver disciplinas ou professores', () => {
    component.classRoom = {
      id: 2,
      name: 'Sala B',
      capacity: 20,
      schedule: 'Ter 10:00-12:00',
      subjects: [],
      teachers: [],
      classTeacher: undefined
    };
    fixture.detectChanges();

    const noSubjects = fixture.debugElement.query(By.css('.detailsRow:nth-child(4) .muted')).nativeElement;
    expect(noSubjects.textContent).toContain('Sem disciplinas vinculadas.');

    const noTeachers = fixture.debugElement.query(By.css('.detailsRow:nth-child(5) .muted')).nativeElement;
    expect(noTeachers.textContent).toContain('Sem professores vinculados.');

    const classTeacherEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(6) .detailsValue')).nativeElement;
    expect(classTeacherEl.textContent).toContain('Não definido');
  });

  it('deve mostrar template de loading quando classRoom não está definido', () => {
    component.classRoom = null;
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('ng-template ~ p'));
    expect(loadingEl.nativeElement.textContent).toContain('Carregando...');
  });
});
