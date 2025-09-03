// src/services/subject.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { SubjectService } from './subject.service';
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
      expect(subjects.length).toBe(4); // Pelo mock inicial do service
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

  it('should add a new subject', (done) => {
    const newSubject: Subject = { id: 5, name: 'Geografia', description: 'Geografia básica', workloadHours: 50 };
    service.add(newSubject);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.length).toBe(5);
      expect(subjects.find(s => s.id === 5)).toEqual(newSubject);
      done();
    });
  });

  it('should update existing subject', (done) => {
    const updated: Subject = { ...service.snapshot()[0], name: 'Matemática Avançada' };
    service.update(updated);

    service.getById(updated.id).subscribe(subject => {
      expect(subject?.name).toBe('Matemática Avançada');
      done();
    });
  });

  it('should not update non-existent subject', (done) => {
    const updated: Subject = { id: 999, name: 'Não Existe', description: 'Nada', workloadHours: 0 };
    service.update(updated);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.length).toBe(4); // mock inicial permanece
      done();
    });
  });

  it('should delete subject by id', (done) => {
    const idToDelete = service.snapshot()[0].id;
    service.delete(idToDelete);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.find(s => s.id === idToDelete)).toBeUndefined();
      expect(subjects.length).toBe(3);
      done();
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999);

    service.getAll().pipe(take(1)).subscribe(subjects => {
      expect(subjects.length).toBe(4);
      done();
    });
  });

  it('should return snapshot of current subjects', () => {
    const snapshot = service.snapshot();
    expect(snapshot.length).toBe(4);
    expect(snapshot[0].name).toBe('Matemática');
  });
});
