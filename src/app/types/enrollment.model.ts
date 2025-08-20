// src/app/types/enrollment.model.ts

export interface Enrollment {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string; // ISO date string
  status: string;
}
