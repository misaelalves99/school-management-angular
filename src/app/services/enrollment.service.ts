// src/services/enrollment.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

/** FormData para criar ou editar matrícula */
export interface EnrollmentForm {
  studentId: number;     // Sempre number
  classRoomId: number;   // Sempre number
  enrollmentDate: string;
}

/** Matrícula completa */
export interface Enrollment extends EnrollmentForm {
  id: number;
  status: 'Ativo' | 'Inativo';
}

const initialEnrollments: Enrollment[] = [
  { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-10', status: 'Ativo' },
  { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-01-15', status: 'Inativo' },
  { id: 3, studentId: 1, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Ativo' },
];

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private enrollmentsSubject = new BehaviorSubject<Enrollment[]>(initialEnrollments);
  enrollments$ = this.enrollmentsSubject.asObservable();

  /** Lista todas as matrículas */
  getAll(): Observable<Enrollment[]> {
    return this.enrollments$;
  }

  /** Busca matrícula pelo ID */
  getById(id: number): Observable<Enrollment | undefined> {
    const enrollment = this.enrollmentsSubject.getValue().find(e => e.id === id);
    return of(enrollment);
  }

  /** Adiciona nova matrícula */
  add(form: EnrollmentForm): Observable<Enrollment> {
    const current = this.enrollmentsSubject.getValue();
    const newEnrollment: Enrollment = {
      ...form,
      id: current.length ? Math.max(...current.map(e => e.id)) + 1 : 1,
      status: 'Ativo',
    };
    this.enrollmentsSubject.next([...current, newEnrollment]);
    return of(newEnrollment);
  }

  /** Atualiza matrícula existente */
  update(enrollment: Enrollment): Observable<Enrollment | null> {
    const current = this.enrollmentsSubject.getValue();
    const index = current.findIndex(e => e.id === enrollment.id);
    if (index === -1) return of(null);

    current[index] = enrollment;
    this.enrollmentsSubject.next([...current]);
    return of(current[index]);
  }

  /** Deleta matrícula */
  delete(id: number): Observable<void> {
    const current = this.enrollmentsSubject.getValue();
    this.enrollmentsSubject.next(current.filter(e => e.id !== id));
    return of(void 0); // Retorna Observable para permitir subscribe()
  }

  /** Snapshot atual das matrículas */
  snapshot(): Enrollment[] {
    return this.enrollmentsSubject.getValue();
  }
}
