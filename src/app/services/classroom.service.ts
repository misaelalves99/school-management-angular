// src/services/classroom.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ClassRoom } from '../types/classroom.model';
import { Teacher } from '../types/teacher.model';
import { Subject } from '../types/subject.model';

/** Dados para criar/atualizar uma sala */
export type ClassRoomFormData = Omit<ClassRoom, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class ClassRoomService {
  // Professores simulados
  private mockTeachers: Teacher[] = [
    { id: 1, name: 'João Silva', email: 'joao.silva@email.com', dateOfBirth: '1980-05-12', subject: 'Matemática', phone: '123456789', address: 'Rua A, 123' },
    { id: 2, name: 'Maria Souza', email: 'maria.souza@email.com', dateOfBirth: '1975-10-30', subject: 'História', phone: '987654321', address: 'Av. B, 456' },
  ];

  // Disciplinas simuladas
  private mockSubjects: Subject[] = [
    { id: 1, name: 'Matemática', description: 'Estudo de números, álgebra e geometria', workloadHours: 60 },
    { id: 2, name: 'História', description: 'Estudo do passado da humanidade', workloadHours: 45 },
    { id: 3, name: 'Física', description: 'Estudo das leis naturais e fenômenos físicos', workloadHours: 50 },
  ];

  // Mock inicial de salas
  private initialClassRooms: ClassRoom[] = [
    {
      id: 1,
      name: 'Sala A1',
      capacity: 30,
      schedule: '08:00 - 10:00',
      classTeacher: this.mockTeachers[0],
      teachers: [this.mockTeachers[0]],
      subjects: [this.mockSubjects[0], this.mockSubjects[2]],
    },
    {
      id: 2,
      name: 'Sala B1',
      capacity: 25,
      schedule: '10:00 - 12:00',
      classTeacher: this.mockTeachers[1],
      teachers: [this.mockTeachers[1]],
      subjects: [this.mockSubjects[1]],
    },
    {
      id: 3,
      name: 'Laboratório de Física',
      capacity: 20,
      schedule: '13:00 - 15:00',
      classTeacher: this.mockTeachers[0],
      teachers: [this.mockTeachers[0]],
      subjects: [this.mockSubjects[2]],
    },
  ];

  private classroomsSubject = new BehaviorSubject<ClassRoom[]>(this.initialClassRooms);
  classrooms$ = this.classroomsSubject.asObservable();

  /** Lista todas as salas */
  getAll(): Observable<ClassRoom[]> {
    return this.classrooms$;
  }

  /** Busca sala por ID */
  getById(id: number): Observable<ClassRoom | undefined> {
    const classroom = this.classroomsSubject.getValue().find(c => c.id === id);
    return of(classroom);
  }

  /** Cria nova sala */
  add(classroom: ClassRoomFormData): void {
    const current = this.classroomsSubject.getValue();
    const newClassroom: ClassRoom = {
      ...classroom,
      id: current.length ? Math.max(...current.map(c => c.id)) + 1 : 1,
    };
    this.classroomsSubject.next([...current, newClassroom]);
  }

  /** Atualiza sala existente */
  update(classroom: ClassRoom): void {
    const current = this.classroomsSubject.getValue();
    const index = current.findIndex(c => c.id === classroom.id);
    if (index !== -1) {
      current[index] = classroom;
      this.classroomsSubject.next([...current]);
    }
  }

  /** Remove sala pelo ID */
  delete(id: number): void {
    const current = this.classroomsSubject.getValue();
    this.classroomsSubject.next(current.filter(c => c.id !== id));
  }

  /** Lista todos os professores mockados */
  getTeachers(): Observable<Teacher[]> {
    return of(this.mockTeachers);
  }

  /** Lista todas as disciplinas mockadas */
  getSubjects(): Observable<Subject[]> {
    return of(this.mockSubjects);
  }

  /** Snapshot atual das salas */
  snapshot(): ClassRoom[] {
    return this.classroomsSubject.getValue();
  }
}
