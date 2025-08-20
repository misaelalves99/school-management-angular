// src/services/classroom.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ClassRoom } from '../types/classroom.model';

@Injectable({
  providedIn: 'root',
})
export class ClassRoomService {
  // Inicialmente vazio — o service controla os dados
  private classroomsSubject = new BehaviorSubject<ClassRoom[]>([]);
  classrooms$ = this.classroomsSubject.asObservable();

  getAll(): Observable<ClassRoom[]> {
    return this.classrooms$;
  }

  getById(id: number): Observable<ClassRoom | undefined> {
    const classroom = this.classroomsSubject.getValue().find(c => c.id === id);
    return of(classroom);
  }

  add(classroom: ClassRoom): void {
    const current = this.classroomsSubject.getValue();
    this.classroomsSubject.next([...current, classroom]);
  }

  update(classroom: ClassRoom): void {
    const current = this.classroomsSubject.getValue();
    const index = current.findIndex(c => c.id === classroom.id);
    if (index !== -1) {
      current[index] = classroom;
      this.classroomsSubject.next([...current]);
    }
  }

  delete(id: number): void {
    const current = this.classroomsSubject.getValue();
    this.classroomsSubject.next(current.filter(c => c.id !== id));
  }
}
