// src/services/teacher.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { TeacherService } from './teacher.service';
import { Teacher, TeacherFormData } from '../types/teacher.model';
import { take } from 'rxjs/operators';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial teachers', (done) => {
    service.getAll().pipe(take(1)).subscribe(teachers => {
      expect(teachers.length).toBe(2);
      expect(teachers[0].name).toBe('João Silva');
      expect(teachers[1].name).toBe('Maria Souza');
      done();
    });
  });

  it('should get teacher by id', (done) => {
    service.getById(1).subscribe(teacher => {
      expect(teacher?.name).toBe('João Silva');
      done();
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getById(999).subscribe(teacher => {
      expect(teacher).toBeUndefined();
      done();
    });
  });

  it('should create a new teacher', (done) => {
    const newTeacher: TeacherFormData = {
      name: 'Carlos Lima',
      email: 'carlos.lima@email.com',
      dateOfBirth: '1990-03-20',
      subject: 'Física',
      phone: '555555555',
      address: 'Rua C, 789',
      photoUrl: 'https://i.pravatar.cc/150?img=3',
    };

    service.create(newTeacher).subscribe(created => {
      expect(created.id).toBeGreaterThan(0);
      expect(created.name).toBe('Carlos Lima');

      service.getAll().pipe(take(1)).subscribe(all => {
        expect(all.length).toBe(3);
        expect(all.find(t => t.id === created.id)).toBeTruthy();
        done();
      });
    });
  });

  it('should update existing teacher', (done) => {
    service.update(1, { name: 'João Atualizado' }).subscribe(updated => {
      expect(updated?.name).toBe('João Atualizado');
      done();
    });
  });

  it('should return null when updating non-existent teacher', (done) => {
    service.update(999, { name: 'Não existe' }).subscribe(updated => {
      expect(updated).toBeNull();
      done();
    });
  });

  it('should delete teacher by id', (done) => {
    service.delete(1).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe(all => {
        expect(all.find(t => t.id === 1)).toBeUndefined();
        expect(all.length).toBe(1);
        done();
      });
    });
  });

  it('should do nothing when deleting non-existent teacher', (done) => {
    service.delete(999).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe(all => {
        expect(all.length).toBe(2); // mock inicial permanece
        done();
      });
    });
  });

  it('should return snapshot of current teachers', () => {
    const snapshot = service.snapshot();
    expect(snapshot.length).toBe(2);
    expect(snapshot[0].name).toBe('João Silva');
  });
});
