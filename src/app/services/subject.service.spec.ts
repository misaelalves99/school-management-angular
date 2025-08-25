// src/services/subject.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { SubjectService } from './subject.service';
import { Subject } from '../types/subject.model';
import { take } from 'rxjs/operators';

describe('SubjectService', () => {
  let service: SubjectService;

  const initialSubjects: Subject[] = [
    { id: 1, name: 'Matemática', description: 'Matemática básica', workloadHours: 60 },
    { id: 2, name: 'Física', description: 'Física básica', workloadHours: 60 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectService);

    // Popula dados iniciais
    initialSubjects.forEach(s => service.add(s));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all subjects', (done) => {
    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects).toEqual(initialSubjects);
      done();
    });
  });

  it('should return subject by id', (done) => {
    service.getById(2).subscribe(subject => {
      expect(subject).toEqual(initialSubjects[1]);
      done();
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getById(999).subscribe(subject => {
      expect(subject).toBeUndefined();
      done();
    });
  });

  it('should add a new subject', (done) => {
    const newSubject: Subject = { id: 3, name: 'Química', description: 'Química básica', workloadHours: 60 };
    service.add(newSubject);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.length).toBe(3);
      expect(subjects).toContain(newSubject);
      done();
    });
  });

  it('should update existing subject', (done) => {
    const updated: Subject = { ...initialSubjects[0], name: 'Matemática Avançada' };
    service.update(updated);

    service.getById(1).subscribe(subject => {
      expect(subject?.name).toBe('Matemática Avançada');
      done();
    });
  });

  it('should not update non-existent subject', (done) => {
    const updated: Subject = { id: 999, name: 'Não Existe', description: 'Nada', workloadHours: 0 };
    service.update(updated);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.length).toBe(2);
      done();
    });
  });

  it('should delete subject by id', (done) => {
    service.delete(1);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.find(s => s.id === 1)).toBeUndefined();
      expect(subjects.length).toBe(1);
      done();
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.length).toBe(2);
      done();
    });
  });
});
