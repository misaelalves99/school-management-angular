// src/app/types/classroom.model.ts

import { Subject } from './subject.model';
import { Teacher } from './teacher.model';

export interface ClassRoom {
  id: number;
  name: string;
  capacity: number;
  schedule: string;
  classTeacher?: Teacher;
  teachers?: Teacher[];
  subjects: Subject[];
}
