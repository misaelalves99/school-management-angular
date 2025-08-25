// src/services/classroom.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { ClassRoomService } from './classroom.service';
import { ClassRoom } from '../types/classroom.model';
import { take } from 'rxjs/operators';

describe('ClassRoomService', () => {
  let service: ClassRoomService;

  const mockClassrooms: ClassRoom[] = [
    { id: 1, name: 'Sala A', capacity: 30, schedule: 'Seg - 08:00 às 10:00', subjects: [] },
    { id: 2, name: 'Sala B', capacity: 25, schedule: 'Ter - 10:00 às 12:00', subjects: [] },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array initially', (done) => {
    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms).toEqual([]);
      done();
    });
  });

  it('should add a classroom', (done) => {
    const newClassroom: ClassRoom = { id: 1, name: 'Sala A', capacity: 30, schedule: '', subjects: [] };
    service.add(newClassroom);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms.length).toBe(1);
      expect(classrooms[0]).toEqual(newClassroom);
      done();
    });
  });

  it('should get classroom by id', (done) => {
    const classroom: ClassRoom = { id: 1, name: 'Sala A', capacity: 30, schedule: '', subjects: [] };
    service.add(classroom);

    service.getById(1).subscribe((c) => {
      expect(c).toEqual(classroom);
      done();
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getById(999).subscribe((c) => {
      expect(c).toBeUndefined();
      done();
    });
  });

  it('should update existing classroom', (done) => {
    const classroom: ClassRoom = { id: 1, name: 'Sala A', capacity: 30, schedule: '', subjects: [] };
    service.add(classroom);

    const updated: ClassRoom = { ...classroom, name: 'Sala A - Atualizada' };
    service.update(updated);

    service.getById(1).subscribe((c) => {
      expect(c?.name).toBe('Sala A - Atualizada');
      done();
    });
  });

  it('should not update non-existent classroom', (done) => {
    const updated: ClassRoom = { id: 999, name: 'Sala X', capacity: 0, schedule: '', subjects: [] };
    service.update(updated);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms).toEqual([]);
      done();
    });
  });

  it('should delete classroom by id', (done) => {
    const classroom: ClassRoom = { id: 1, name: 'Sala A', capacity: 30, schedule: '', subjects: [] };
    service.add(classroom);

    service.delete(1);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms).toEqual([]);
      done();
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    const classroom: ClassRoom = { id: 1, name: 'Sala A', capacity: 30, schedule: '', subjects: [] };
    service.add(classroom);

    service.delete(999);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms.length).toBe(1);
      done();
    });
  });
});
