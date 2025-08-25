// src/services/enrollment.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { EnrollmentService, Enrollment } from './enrollment.service';
import { take } from 'rxjs/operators';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  const initialEnrollments: Enrollment[] = [
    { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-10', status: 'Ativo' },
    { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-01-15', status: 'Inativo' },
    { id: 3, studentId: 1, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Ativo' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial enrollments', (done) => {
    service.getAll().pipe(take(1)).subscribe((enrollments) => {
      expect(enrollments).toEqual(initialEnrollments);
      done();
    });
  });

  it('should get enrollment by id', (done) => {
    service.getById(2).subscribe((enrollment) => {
      expect(enrollment).toEqual(initialEnrollments[1]);
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
    const newEnrollment: Enrollment = { id: 4, studentId: 3, classRoomId: 1, enrollmentDate: '2025-03-01', status: 'Ativo' };
    service.add(newEnrollment);

    service.getAll().pipe(take(1)).subscribe((enrollments) => {
      expect(enrollments.length).toBe(4);
      expect(enrollments).toContain(newEnrollment);
      done();
    });
  });

  it('should update existing enrollment', (done) => {
    const updated: Enrollment = { ...initialEnrollments[0], status: 'Inativo' };
    service.update(updated);

    service.getById(1).subscribe((enrollment) => {
      expect(enrollment?.status).toBe('Inativo');
      done();
    });
  });

  it('should not update non-existent enrollment', (done) => {
    const updated: Enrollment = { id: 999, studentId: 5, classRoomId: 5, enrollmentDate: '2025-04-01', status: 'Ativo' };
    service.update(updated);

    service.getAll().pipe(take(1)).subscribe((enrollments) => {
      expect(enrollments.length).toBe(initialEnrollments.length);
      done();
    });
  });

  it('should delete enrollment by id', (done) => {
    service.delete(1);

    service.getAll().pipe(take(1)).subscribe((enrollments) => {
      expect(enrollments.find(e => e.id === 1)).toBeUndefined();
      expect(enrollments.length).toBe(initialEnrollments.length - 1);
      done();
    });
  });

  it('should do nothing when deleting non-existent id', (done) => {
    service.delete(999);

    service.getAll().pipe(take(1)).subscribe((enrollments) => {
      expect(enrollments.length).toBe(initialEnrollments.length);
      done();
    });
  });
});
