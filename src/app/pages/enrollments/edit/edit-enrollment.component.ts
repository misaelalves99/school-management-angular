// src/pages/enrollments/edit/edit-enrollment.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface EnrollmentEdit {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string; // ISO date string
  status: string;
}

type EnrollmentErrors = {
  studentId?: string;
  classRoomId?: string;
  enrollmentDate?: string;
};

@Component({
  selector: 'app-edit-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-enrollment.component.html',
  styleUrls: ['./edit-enrollment.component.css'],
})
export class EditEnrollmentComponent {
  @Input() enrollment!: EnrollmentEdit;
  @Input() onSave!: (data: EnrollmentEdit) => Promise<void>;

  formData!: EnrollmentEdit;
  errors: EnrollmentErrors = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.formData = { ...this.enrollment };
  }

  handleChange(event: Event, field: keyof EnrollmentEdit) {
    const target = event.target as HTMLInputElement;

    // mapeamento explícito para evitar erro de `never`
    if (field === 'studentId' || field === 'classRoomId') {
      this.formData = {
        ...this.formData,
        [field]: Number(target.value) as any,
      };
    } else if (field === 'enrollmentDate' || field === 'status') {
      this.formData = {
        ...this.formData,
        [field]: target.value as any,
      };
    }
  }

  async handleSubmit() {
    this.errors = {};

    if (!this.formData.studentId) {
      this.errors.studentId = 'Aluno é obrigatório.';
    }
    if (!this.formData.classRoomId) {
      this.errors.classRoomId = 'Turma é obrigatória.';
    }
    if (!this.formData.enrollmentDate) {
      this.errors.enrollmentDate = 'Data da matrícula é obrigatória.';
    }

    if (Object.keys(this.errors).length > 0) return;

    try {
      await this.onSave(this.formData);
      this.router.navigate(['/enrollments']);
    } catch (error) {
      console.error('Erro ao salvar matrícula:', error);
    }
  }

  back() {
    this.router.navigate(['/enrollments']);
  }
}
