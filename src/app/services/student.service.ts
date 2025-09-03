// src/services/student.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Student } from '../types/student.model';

/** Dados para criar um novo estudante */
export type StudentFormData = Omit<Student, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // Mock inicial de estudantes
  private initialStudents: Student[] = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      dateOfBirth: '2000-01-15',
      enrollmentNumber: '20230001',
      phone: '123456789',
      address: 'Rua A, 123',
    },
    {
      id: 2,
      name: 'Maria Souza',
      email: 'maria.souza@email.com',
      dateOfBirth: '1999-05-30',
      enrollmentNumber: '20230002',
      phone: '987654321',
      address: 'Av. B, 456',
    },
  ];

  private studentsSubject = new BehaviorSubject<Student[]>(this.initialStudents);
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
      id: current.length ? Math.max(...current.map(s => s.id)) + 1 : 1,
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
