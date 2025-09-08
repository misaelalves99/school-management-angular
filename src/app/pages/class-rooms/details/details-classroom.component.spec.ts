// src/pages/class-rooms/details/details-classroom.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DetailsClassroomComponent } from './details-classroom.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ClassRoomService } from '../../../services/classroom.service';
import { ClassRoom } from '../../../types/classroom.model';
import { By } from '@angular/platform-browser';

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
    subjects: [],
    teachers: [],
    classTeacher: undefined
  };

  beforeEach(async () => {
    const classRoomServiceSpy = jasmine.createSpyObj('ClassRoomService', ['getById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DetailsClassroomComponent], // standalone
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
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap.get as any) = () => null;

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('ID da sala inválido');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  });

  it('ngOnInit deve alertar e navegar se sala não encontrada', fakeAsync(() => {
    spyOn(window, 'alert');
    classRoomService.getById.and.returnValue(of(undefined));

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Sala não encontrada');
    expect(router.navigate).toHaveBeenCalledWith(['/classrooms']);
  }));

  it('deve renderizar dados da turma corretamente no template', fakeAsync(() => {
    classRoomService.getById.and.returnValue(of(mockClassRoom));
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const nameEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(1) .detailsValue')).nativeElement;
    expect(nameEl.textContent).toContain('Sala A');

    const capacityEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(2) .detailsValue')).nativeElement;
    expect(capacityEl.textContent).toContain('30');

    const scheduleEl = fixture.debugElement.query(By.css('.detailsRow:nth-child(3) .detailsValue')).nativeElement;
    expect(scheduleEl.textContent).toContain('Seg 08:00-10:00');

    const editBtn = fixture.debugElement.query(By.css('.btnWarning')).nativeElement;
    const backBtn = fixture.debugElement.query(By.css('.btnSecondary')).nativeElement;
    expect(editBtn.getAttribute('ng-reflect-router-link')).toContain('/classrooms/edit/1');
    expect(backBtn.getAttribute('ng-reflect-router-link')).toBe('/classrooms');
  }));

  it('deve mostrar template de loading quando classRoom não está definido', () => {
    component.classRoom = null;
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('p'));
    expect(loadingEl.nativeElement.textContent).toContain('Carregando...');
  });
});
