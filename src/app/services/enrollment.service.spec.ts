// src/services/enrollment.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { EnrollmentService, Enrollment, EnrollmentForm } from './enrollment.service';
import { take } from 'rxjs/operators';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial enrollments', (done) => {
    service.getAll().pipe(take(1)).subscribe((enrollments) => {
      expect(enrollments.length).toBe(3);
      expect(enrollments[0].id).toBe(1);
      done();
    });
  });

  it('should get enrollment by id', (done) => {
    service.getById(2).subscribe((enrollment) => {
      expect(enrollment?.id).toBe(2);
      done();
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getById(999).subscribe((enrollment) => {
      expect(enrollment).toBeUndefined();
      done();
    });
  });

  it('should add a new enrollment', (done) => {
    const newForm: EnrollmentForm = { studentId: 3, classRoomId: 1, enrollmentDate: '2025-03-01' };
    service.add(newForm).subscribe((newEnrollment) => {
      expect(newEnrollment.id).toBeGreaterThan(0);
      expect(newEnrollment.status).toBe('Ativo');

      service.getAll().pipe(take(1)).subscribe((all) => {
        expect(all.length).toBe(4);
        expect(all.find(e => e.id === newEnrollment.id)).toBeTruthy();
        done();
      });
    });
  });

  it('should update existing enrollment', (done) => {
    service.getById(1).subscribe((enrollment) => {
      if (!enrollment) return;
      const updated: Enrollment = { ...enrollment, status: 'Inativo' };
      service.update(updated).subscribe((res) => {
        expect(res?.status).toBe('Inativo');
        service.getById(1).subscribe((e) => {
          expect(e?.status).toBe('Inativo');
          done();
        });
      });
    });
  });

  it('should return null when updating non-existent enrollment', (done) => {
    const fake: Enrollment = { id: 999, studentId: 5, classRoomId: 5, enrollmentDate: '2025-04-01', status: 'Ativo' };
    service.update(fake).subscribe((res) => {
      expect(res).toBeNull();
      done();
    });
  });

  it('should delete enrollment by id', (done) => {
    service.delete(1).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe((all) => {
        expect(all.find(e => e.id === 1)).toBeUndefined();
        expect(all.length).toBe(2);
        done();
      });
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999).subscribe(() => {
      service.getAll().pipe(take(1)).subscribe((all) => {
        expect(all.length).toBe(3); // mantem as 3 matrículas iniciais
        done();
      });
    });
  });

  it('should return snapshot of current enrollments', () => {
    const snapshot = service.snapshot();
    expect(snapshot.length).toBe(3);
    expect(snapshot[0].id).toBe(1);
  });
});
