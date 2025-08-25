// src/pages/class-rooms/details/details-classroom.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsClassroomComponent } from './details-classroom.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ClassRoom } from '../../../types/classroom.model';

describe('DetailsClassroomComponent', () => {
  let component: DetailsClassroomComponent;
  let fixture: ComponentFixture<DetailsClassroomComponent>;

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
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [DetailsClassroomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsClassroomComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar dados da turma quando classRoom é fornecida', () => {
    component.classRoom = mockClassRoom;
    fixture.detectChanges();

    // Nome da sala
    const nameEl = fixture.debugElement.query(By.css('dd')).nativeElement;
    expect(nameEl.textContent).toContain('Sala A');

    // Disciplinas
    const subjectList = fixture.debugElement.queryAll(By.css('dd ul li')).slice(0, 2);
    expect(subjectList[0].nativeElement.textContent).toBe('Matemática');
    expect(subjectList[1].nativeElement.textContent).toBe('Física');

    // Professor responsável
    const teacherEl = fixture.debugElement.queryAll(By.css('dd ul li')).slice(2);
    expect(teacherEl[0].nativeElement.textContent).toBe('Prof. Ana');
  });

  it('deve mostrar mensagem alternativa se não houver disciplinas ou professores', () => {
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

    const noSubjects = fixture.debugElement.query(By.css('dd span.muted')).nativeElement;
    expect(noSubjects.textContent).toContain('Sem disciplinas vinculadas.');

    const classTeacherEl = fixture.debugElement.queryAll(By.css('dd'))[5].nativeElement;
    expect(classTeacherEl.textContent).toContain('Não definido');
  });

  it('deve mostrar template de loading quando classRoom não está definido', () => {
    component.classRoom = undefined as any;
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('ng-template ~ p'));
    expect(loadingEl.nativeElement.textContent).toContain('Carregando...');
  });
});
