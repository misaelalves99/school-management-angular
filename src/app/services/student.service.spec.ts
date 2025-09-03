// src/services/student.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { StudentService, StudentFormData } from './student.service';
import { take } from 'rxjs/operators';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial students', (done) => {
    service.getAll().pipe(take(1)).subscribe((students) => {
      expect(students.length).toBe(2);
      expect(students[0].name).toBe('João Silva');
      done();
    });
  });

  it('should get student by id', (done) => {
    service.getById(2).subscribe((student) => {
      expect(student?.name).toBe('Maria Souza');
      done();
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getById(999).subscribe((student) => {
      expect(student).toBeUndefined();
      done();
    });
  });

  it('should create a new student', (done) => {
    const newStudentData: StudentFormData = {
      name: 'Carlos',
      email: 'carlos@email.com',
      dateOfBirth: '2001-06-15',
      enrollmentNumber: '20230003',
      phone: '555555555',
      address: 'Rua C',
    };
    service.create(newStudentData).subscribe((newStudent) => {
      expect(newStudent.id).toBeGreaterThan(0);
      expect(newStudent.name).toBe('Carlos');

      service.getAll().pipe(take(1)).subscribe((all) => {
        expect(all.length).toBe(3);
        expect(all.find(s => s.id === newStudent.id)).toBeTruthy();
        done();
      });
    });
  });

  it('should update existing student', (done) => {
    service.update(1, { name: 'João Atualizado' }).subscribe((updated) => {
      expect(updated?.name).toBe('João Atualizado');

      service.getById(1).subscribe((s) => {
        expect(s?.name).toBe('João Atualizado');
        done();
      });
    });
  });

  it('should return null when updating non-existent student', (done) => {
    service.update(999, { name: 'Não Existe' }).subscribe((updated) => {
      expect(updated).toBeNull();
      done();
    });
  });

  it('should delete student by id', (done) => {
    service.delete(1).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe((students) => {
        expect(students.find(s => s.id === 1)).toBeUndefined();
        expect(students.length).toBe(1);
        done();
      });
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe((students) => {
        expect(students.length).toBe(2);
        done();
      });
    });
  });

  it('should return snapshot of current students', () => {
    const snapshot = service.snapshot();
    expect(snapshot.length).toBe(2);
    expect(snapshot[0].name).toBe('João Silva');
  });
});
