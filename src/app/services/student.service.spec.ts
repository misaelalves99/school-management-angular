// src/services/student.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { Student } from '../types/student.model';
import { take } from 'rxjs/operators';

describe('StudentService', () => {
  let service: StudentService;

  const initialStudents: Student[] = [
    { id: 1, name: 'Aluno 1', enrollmentNumber: '20230001', phone: '123456789', address: 'Rua A' },
    { id: 2, name: 'Aluno 2', enrollmentNumber: '20230002', phone: '987654321', address: 'Rua B' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentService);

    // Preenche os dados iniciais
    initialStudents.forEach(s => service.add(s));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all students', (done) => {
    service.getAll().pipe(take(1)).subscribe((students) => {
      expect(students).toEqual(initialStudents);
      done();
    });
  });

  it('should return student by id', (done) => {
    service.getById(2).subscribe((student) => {
      expect(student).toEqual(initialStudents[1]);
      done();
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getById(999).subscribe((student) => {
      expect(student).toBeUndefined();
      done();
    });
  });

  it('should add a new student', (done) => {
    const newStudent: Student = {
      id: 3,
      name: 'Aluno 3',
      enrollmentNumber: '20230003',
      phone: '555555555',
      address: 'Rua C'
    };
    service.add(newStudent);

    service.getAll().pipe(take(1)).subscribe((students) => {
      expect(students.length).toBe(3);
      expect(students).toContain(newStudent);
      done();
    });
  });

  it('should update existing student', (done) => {
    const updated: Student = { ...initialStudents[0], name: 'Aluno 1 Atualizado' };
    service.update(updated);

    service.getById(1).subscribe((student) => {
      expect(student?.name).toBe('Aluno 1 Atualizado');
      done();
    });
  });

  it('should not update non-existent student', (done) => {
    const updated: Student = {
      id: 999,
      name: 'Não Existe',
      enrollmentNumber: '99999999',
      phone: '000000000',
      address: 'Rua X'
    };
    service.update(updated);

    service.getAll().pipe(take(1)).subscribe((students) => {
      expect(students.length).toBe(2);
      done();
    });
  });

  it('should delete student by id', (done) => {
    service.delete(1);

    service.getAll().pipe(take(1)).subscribe((students) => {
      expect(students.find(s => s.id === 1)).toBeUndefined();
      expect(students.length).toBe(1);
      done();
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999);

    service.getAll().pipe(take(1)).subscribe((students) => {
      expect(students.length).toBe(2);
      done();
    });
  });
});
