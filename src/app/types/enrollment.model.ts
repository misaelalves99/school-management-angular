// src/app/types/enrollment.model.ts

export type EnrollmentStatus = 'Ativo' | 'Inativo';

export interface Enrollment {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string;
  status: EnrollmentStatus;
}
