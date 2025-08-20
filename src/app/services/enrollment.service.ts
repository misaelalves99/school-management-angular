// src/services/enrollment.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export type Enrollment = {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string;
  status: string;
};

const initialEnrollments: Enrollment[] = [
  {
    id: 1,
    studentId: 1,
    classRoomId: 1,
    enrollmentDate: '2025-01-10',
    status: 'Ativo',
  },
  {
    id: 2,
    studentId: 2,
    classRoomId: 2,
    enrollmentDate: '2025-01-15',
    status: 'Inativo',
  },
  {
    id: 3,
    studentId: 1,
    classRoomId: 2,
    enrollmentDate: '2025-02-01',
    status: 'Ativo',
  },
];

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private enrollmentsSubject = new BehaviorSubject<Enrollment[]>(initialEnrollments);
  enrollments$ = this.enrollmentsSubject.asObservable();

  getAll(): Observable<Enrollment[]> {
    return this.enrollments$;
  }

  getById(id: number): Observable<Enrollment | undefined> {
    const enrollment = this.enrollmentsSubject.getValue().find(e => e.id === id);
    return of(enrollment);
  }

  add(enrollment: Enrollment): void {
    const current = this.enrollmentsSubject.getValue();
    this.enrollmentsSubject.next([...current, enrollment]);
  }

  update(enrollment: Enrollment): void {
    const current = this.enrollmentsSubject.getValue();
    const index = current.findIndex(e => e.id === enrollment.id);
    if (index !== -1) {
      current[index] = enrollment;
      this.enrollmentsSubject.next([...current]);
    }
  }

  delete(id: number): void {
    const current = this.enrollmentsSubject.getValue();
    this.enrollmentsSubject.next(current.filter(e => e.id !== id));
  }
}
