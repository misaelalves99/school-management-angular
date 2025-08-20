// src/pages/enrollments/create/create-enrollment.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Student {
  id: number;
  name: string;
}

export interface ClassRoom {
  id: number;
  name: string;
}

export interface EnrollmentForm {
  studentId: number | '';
  classRoomId: number | '';
  enrollmentDate: string;
}

interface ValidationErrors {
  studentId?: string;
  classRoomId?: string;
  enrollmentDate?: string;
}

@Component({
  selector: 'app-create-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-enrollment.component.html',
  styleUrls: ['./create-enrollment.component.css'],
})
export class CreateEnrollmentComponent {
  @Input() students: Student[] = [];
  @Input() classRooms: ClassRoom[] = [];
  @Input() onCreate!: (data: EnrollmentForm) => Promise<void>;

  form: EnrollmentForm = {
    studentId: '',
    classRoomId: '',
    enrollmentDate: new Date().toISOString().slice(0, 10),
  };

  errors: ValidationErrors = {};

  constructor(private router: Router) {}

  validate(): boolean {
    const newErrors: ValidationErrors = {};

    if (!this.form.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!this.form.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!this.form.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async handleSubmit() {
    if (!this.validate()) return;

    try {
      await this.onCreate(this.form);
      this.router.navigate(['/enrollments']);
    } catch (error) {
      console.error(error);
    }
  }

  goBack() {
    this.router.navigate(['/enrollments']);
  }
}
