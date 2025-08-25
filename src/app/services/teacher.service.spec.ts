// src/services/teacher.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { TeacherService } from './teacher.service';
import { Teacher, TeacherFormData } from '../types/teacher.model';
import { take } from 'rxjs/operators';

describe('TeacherService', () => {
  let service: TeacherService;

  const initialTeachers: Teacher[] = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      dateOfBirth: '1980-05-12',
      subject: 'Matemática',
      phone: '123456789',
      address: 'Rua A, 123',
      photoUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Maria Souza',
      email: 'maria.souza@email.com',
      dateOfBirth: '1975-10-30',
      subject: 'História',
      phone: '987654321',
      address: 'Av. B, 456',
      photoUrl: 'https://i.pravatar.cc/150?img=2',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all teachers', (done) => {
    service.getAll().pipe(take(1)).subscribe(teachers => {
      expect(teachers.length).toBe(initialTeachers.length);
      done();
    });
  });

  it('should return teacher by id', (done) => {
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
        expect(all.length).toBe(initialTeachers.length + 1);
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
        done();
      });
    });
  });

  it('should do nothing when deleting non-existent teacher', (done) => {
    service.delete(999).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe(all => {
        expect(all.length).toBe(initialTeachers.length);
        done();
      });
    });
  });
});
