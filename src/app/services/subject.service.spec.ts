// src/services/subject.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { SubjectService, SubjectFormData } from './subject.service';
import { Subject } from '../types/subject.model';
import { take } from 'rxjs/operators';

describe('SubjectService', () => {
  let service: SubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial subjects', (done) => {
    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.length).toBe(4);
      expect(subjects[0].name).toBe('Matemática');
      done();
    });
  });

  it('should get subject by id', (done) => {
    service.getById(2).subscribe(subject => {
      expect(subject?.name).toBe('História');
      done();
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getById(999).subscribe(subject => {
      expect(subject).toBeUndefined();
      done();
    });
  });

  it('should create a new subject', (done) => {
    const newSubjectData: SubjectFormData = {
      name: 'Geografia',
      description: 'Geografia básica',
      workloadHours: 50
    };
    service.create(newSubjectData).subscribe((newSubject) => {
      expect(newSubject.id).toBeGreaterThan(0);
      expect(newSubject.name).toBe('Geografia');

      service.getAll().pipe(take(1)).subscribe(subjects => {
        expect(subjects.length).toBe(5);
        expect(subjects.find(s => s.id === newSubject.id)).toBeTruthy();
        done();
      });
    });
  });

  it('should update existing subject', (done) => {
    const existing = service.snapshot()[0];
    const updatedData: Partial<Subject> = { name: 'Matemática Avançada' };

    service.update(existing.id, updatedData).subscribe((updated) => {
      expect(updated?.name).toBe('Matemática Avançada');

      service.getById(existing.id).subscribe((s) => {
        expect(s?.name).toBe('Matemática Avançada');
        done();
      });
    });
  });

  it('should return null when updating non-existent subject', (done) => {
    service.update(999, { name: 'Não Existe' }).subscribe((updated) => {
      expect(updated).toBeNull();
      done();
    });
  });

  it('should delete subject by id', (done) => {
    const idToDelete = service.snapshot()[0].id;
    service.delete(idToDelete).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe(subjects => {
        expect(subjects.find(s => s.id === idToDelete)).toBeUndefined();
        expect(subjects.length).toBe(3);
        done();
      });
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe(subjects => {
        expect(subjects.length).toBe(4);
        done();
      });
    });
  });

  it('should return snapshot of current subjects', () => {
    const snapshot = service.snapshot();
    expect(snapshot.length).toBe(4);
    expect(snapshot[0].name).toBe('Matemática');
  });
});
