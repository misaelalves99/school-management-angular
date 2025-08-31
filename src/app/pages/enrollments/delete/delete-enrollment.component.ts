// src/pages/enrollments/delete/delete-enrollment.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';

@Component({
  selector: 'app-delete-enrollment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-enrollment.component.html',
  styleUrls: ['./delete-enrollment.component.css']
})
export class DeleteEnrollmentComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  enrollment: Enrollment | null = null;
  student: Student | null = null;
  classRoom: ClassRoom | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      alert('ID inválido');
      this.router.navigate(['/enrollments']);
      return;
    }

    this.enrollmentService.getById(id).subscribe(enrollment => {
      if (!enrollment) {
        alert('Matrícula não encontrada');
        this.router.navigate(['/enrollments']);
        return;
      }
      this.enrollment = enrollment;

      this.studentService.getById(enrollment.studentId).subscribe(s => this.student = s ?? null);
      this.classRoomService.getById(enrollment.classRoomId).subscribe(c => this.classRoom = c ?? null);
    });
  }

  handleDelete(): void {
    if (!this.enrollment) return;

    const alunoNome = this.student?.name || 'Desconhecido';
    if (!confirm(`Confirma exclusão da matrícula do aluno ${alunoNome}?`)) return;

    this.enrollmentService.delete(this.enrollment.id).subscribe(() => {
      alert(`Matrícula do aluno ${alunoNome} excluída com sucesso!`);
      this.router.navigate(['/enrollments']);
    });
  }

  cancel(): void {
    this.router.navigate(['/enrollments']);
  }
}
