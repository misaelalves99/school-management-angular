// src/services/subject.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Subject } from '../types/subject.model';

export type SubjectFormData = Omit<Subject, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  // Mock inicial de disciplinas
  private initialSubjects: Subject[] = [
    { id: 1, name: 'Matemática', description: 'Estudo de números, álgebra e geometria', workloadHours: 80 },
    { id: 2, name: 'História', description: 'Estudo do passado da humanidade', workloadHours: 60 },
    { id: 3, name: 'Física', description: 'Estudo das leis naturais e fenômenos físicos', workloadHours: 70 },
    { id: 4, name: 'Química', description: 'Estudo da composição da matéria e suas transformações', workloadHours: 65 },
  ];

  private subjectsSubject = new BehaviorSubject<Subject[]>(this.initialSubjects);
  subjects$ = this.subjectsSubject.asObservable();

  /** Lista todas as disciplinas */
  getAll(): Observable<Subject[]> {
    return this.subjects$;
  }

  /** Busca disciplina pelo ID */
  getById(id: number): Observable<Subject | undefined> {
    const subject = this.subjectsSubject.getValue().find(s => s.id === id);
    return of(subject);
  }

  /** Cria nova disciplina */
  create(data: SubjectFormData): Observable<Subject> {
    const current = this.subjectsSubject.getValue();
    const newSubject: Subject = {
      ...data,
      id: current.length > 0 ? Math.max(...current.map(s => s.id)) + 1 : 1,
    };
    this.subjectsSubject.next([...current, newSubject]);
    return of(newSubject);
  }

  /** Atualiza disciplina existente */
  update(id: number, updated: Partial<Subject>): Observable<Subject | null> {
    const current = this.subjectsSubject.getValue();
    const index = current.findIndex(s => s.id === id);
    if (index === -1) return of(null);

    current[index] = { ...current[index], ...updated };
    this.subjectsSubject.next([...current]);
    return of(current[index]);
  }

  /** Deleta disciplina pelo ID */
  delete(id: number): Observable<void> {
    const current = this.subjectsSubject.getValue();
    this.subjectsSubject.next(current.filter(s => s.id !== id));
    return of(void 0);
  }

  /** Retorna snapshot atual (útil para selects e filtros rápidos) */
  snapshot(): Subject[] {
    return this.subjectsSubject.getValue();
  }
}
