// src/pages/enrollments/delete/delete-enrollment.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface EnrollmentDetails {
  id: number;
  studentName: string | null;
  classRoomName: string | null;
  enrollmentDate: string; // ISO string (yyyy-mm-dd)
  status: string; // Mantido para tipagem
}

@Component({
  selector: 'app-delete-enrollment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-enrollment.component.html',
  styleUrls: ['./delete-enrollment.component.css'],
})
export class DeleteEnrollmentComponent {
  @Input() enrollment!: EnrollmentDetails;
  @Input() onDelete!: (id: number) => Promise<void>;

  constructor(private router: Router) {}

  async handleDelete() {
    try {
      await this.onDelete(this.enrollment.id);
      this.router.navigate(['/enrollments']);
    } catch (error) {
      console.error('Erro ao excluir matrícula:', error);
    }
  }

  cancel() {
    this.router.navigate(['/enrollments']);
  }
}
