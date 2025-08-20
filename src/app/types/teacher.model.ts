// src/types/teacher.model.ts
export interface Teacher {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  subject: string;
  phone: string;
  address: string;
  photoUrl?: string; // <-- adicionado (opcional)
}

export type TeacherFormData = Omit<Teacher, 'id'>;
