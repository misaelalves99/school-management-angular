// src/services/classroom.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { ClassRoomService, ClassRoomFormData } from './classroom.service';
import { take } from 'rxjs/operators';

describe('ClassRoomService', () => {
  let service: ClassRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial classrooms', (done) => {
    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms.length).toBe(3); // mock inicial possui 3 salas
      expect(classrooms[0].name).toBe('Sala A1');
      done();
    });
  });

  it('should add a new classroom', (done) => {
    const newClassroom: ClassRoomFormData = {
      name: 'Sala C1',
      capacity: 20,
      schedule: '15:00 - 17:00',
      classTeacher: { id: 1, name: 'João Silva', email: '', dateOfBirth: '', subject: '', phone: '', address: '' },
      teachers: [],
      subjects: [],
    };

    service.add(newClassroom);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms.length).toBe(4);
      expect(classrooms.find(c => c.name === 'Sala C1')).toBeTruthy();
      done();
    });
  });

  it('should get classroom by id', (done) => {
    service.getById(1).subscribe((c) => {
      expect(c?.name).toBe('Sala A1');
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
    service.getById(1).subscribe((c) => {
      if (!c) return;
      const updated = { ...c, name: 'Sala A1 - Atualizada' };
      service.update(updated);

      service.getById(1).subscribe((updatedC) => {
        expect(updatedC?.name).toBe('Sala A1 - Atualizada');
        done();
      });
    });
  });

  it('should not update non-existent classroom', (done) => {
    const fake = { id: 999, name: 'Sala X', capacity: 0, schedule: '', teachers: [], subjects: [], classTeacher: { id: 0, name: '', email: '', dateOfBirth: '', subject: '', phone: '', address: '' } };
    service.update(fake);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms.length).toBe(3); // mantém as salas iniciais
      done();
    });
  });

  it('should delete classroom by id', (done) => {
    service.delete(1);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms.find(c => c.id === 1)).toBeUndefined();
      expect(classrooms.length).toBe(2);
      done();
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999);

    service.getAll().pipe(take(1)).subscribe((classrooms) => {
      expect(classrooms.length).toBe(3); // ainda existem 3 salas
      done();
    });
  });

  it('should return all teachers', (done) => {
    service.getTeachers().pipe(take(1)).subscribe((teachers) => {
      expect(teachers.length).toBe(2);
      expect(teachers[0].name).toBe('João Silva');
      done();
    });
  });

  it('should return all subjects', (done) => {
    service.getSubjects().pipe(take(1)).subscribe((subjects) => {
      expect(subjects.length).toBe(3);
      expect(subjects[0].name).toBe('Matemática');
      done();
    });
  });

  it('should return a snapshot of classrooms', () => {
    const snapshot = service.snapshot();
    expect(snapshot.length).toBe(3);
    expect(snapshot[0].name).toBe('Sala A1');
  });
});
