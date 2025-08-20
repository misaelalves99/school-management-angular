// src/services/teacher.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Teacher } from '../types/teacher.model';
import { TeacherFormData } from '../types/teacher.model';

const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    dateOfBirth: '1980-05-12',
    subject: 'Matemática',
    phone: '123456789',
    address: 'Rua A, 123',
    photoUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Maria Souza',
    email: 'maria.souza@email.com',
    dateOfBirth: '1975-10-30',
    subject: 'História',
    phone: '987654321',
    address: 'Av. B, 456',
    photoUrl: 'https://i.pravatar.cc/150?img=2',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private teachersSubject = new BehaviorSubject<Teacher[]>(initialTeachers);
  teachers$ = this.teachersSubject.asObservable();

  getAll(): Observable<Teacher[]> {
    return this.teachers$;
  }

  getById(id: number): Observable<Teacher | undefined> {
    const teacher = this.teachersSubject.getValue().find(t => t.id === id);
    return of(teacher);
  }

  create(data: TeacherFormData): Observable<Teacher> {
    const current = this.teachersSubject.getValue();
    const newTeacher: Teacher = {
      ...data,
      id: Math.max(0, ...current.map(t => t.id)) + 1,
    };
    this.teachersSubject.next([...current, newTeacher]);
    return of(newTeacher);
  }

  update(id: number, updated: Partial<Teacher>): Observable<Teacher | null> {
    const current = this.teachersSubject.getValue();
    const index = current.findIndex(t => t.id === id);
    if (index === -1) return of(null);

    current[index] = { ...current[index], ...updated };
    this.teachersSubject.next([...current]);
    return of(current[index]);
  }

  delete(id: number): Observable<void> {
    const current = this.teachersSubject.getValue();
    this.teachersSubject.next(current.filter(t => t.id !== id));
    return of(void 0);
  }
}
