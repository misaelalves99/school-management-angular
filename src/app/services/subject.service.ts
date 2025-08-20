// src/services/subject.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Subject } from '../types/subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  // Inicializa vazio — pode ser alimentado dinamicamente depois
  private subjectsSubject = new BehaviorSubject<Subject[]>([]);
  subjects$ = this.subjectsSubject.asObservable();

  getAll(): Observable<Subject[]> {
    return this.subjects$;
  }

  getById(id: number): Observable<Subject | undefined> {
    const subject = this.subjectsSubject.getValue().find(s => s.id === id);
    return of(subject);
  }

  add(subject: Subject): void {
    const current = this.subjectsSubject.getValue();
    this.subjectsSubject.next([...current, subject]);
  }

  update(subject: Subject): void {
    const current = this.subjectsSubject.getValue();
    const index = current.findIndex(s => s.id === subject.id);
    if (index !== -1) {
      current[index] = subject;
      this.subjectsSubject.next([...current]);
    }
  }

  delete(id: number): void {
    const current = this.subjectsSubject.getValue();
    this.subjectsSubject.next(current.filter(s => s.id !== id));
  }
}
