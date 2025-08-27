// src/services/student.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Student } from '../types/student.model';

export type StudentFormData = Omit<Student, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  students$ = this.studentsSubject.asObservable();

  /** Lista todos os alunos */
  getAll(): Observable<Student[]> {
    return this.students$;
  }

  /** Busca aluno pelo ID */
  getById(id: number): Observable<Student | undefined> {
    const student = this.studentsSubject.getValue().find(s => s.id === id);
    return of(student);
  }

  /** Cria um novo aluno */
  create(data: StudentFormData): Observable<Student> {
    const current = this.studentsSubject.getValue();
    const newStudent: Student = {
      ...data,
      id: Math.max(0, ...current.map(s => s.id)) + 1,
    };
    this.studentsSubject.next([...current, newStudent]);
    return of(newStudent);
  }

  /** Atualiza um aluno */
  update(id: number, updated: Partial<Student>): Observable<Student | null> {
    const current = this.studentsSubject.getValue();
    const index = current.findIndex(s => s.id === id);
    if (index === -1) return of(null);

    current[index] = { ...current[index], ...updated };
    this.studentsSubject.next([...current]);
    return of(current[index]);
  }

  /** Deleta um aluno */
  delete(id: number): Observable<void> {
    const current = this.studentsSubject.getValue();
    this.studentsSubject.next(current.filter(s => s.id !== id));
    return of(void 0);
  }

  /** Retorna snapshot atual (útil em buscas e filtros) */
  snapshot(): Student[] {
    return this.studentsSubject.getValue();
  }
}
