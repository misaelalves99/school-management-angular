// src/services/student.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Student } from '../types/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // Inicia vazio — se precisar, pode ser preenchido externamente
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  students$ = this.studentsSubject.asObservable();

  getAll(): Observable<Student[]> {
    return this.students$;
  }

  getById(id: number): Observable<Student | undefined> {
    const student = this.studentsSubject.getValue().find(s => s.id === id);
    return of(student);
  }

  add(student: Student): void {
    const current = this.studentsSubject.getValue();
    this.studentsSubject.next([...current, student]);
  }

  update(student: Student): void {
    const current = this.studentsSubject.getValue();
    const index = current.findIndex(s => s.id === student.id);
    if (index !== -1) {
      current[index] = student;
      this.studentsSubject.next([...current]);
    }
  }

  delete(id: number): void {
    const current = this.studentsSubject.getValue();
    this.studentsSubject.next(current.filter(s => s.id !== id));
  }
}
