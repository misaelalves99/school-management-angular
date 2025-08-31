// src/pages/enrollments/details/details-enrollment.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';

@Component({
  selector: 'app-details-enrollment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-enrollment.component.html',
  styleUrls: ['./details-enrollment.component.css'],
})
export class DetailsEnrollmentComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  enrollment: {
    id: number;
    studentName: string | null;
    classRoomName: string | null;
    status: string | null;
    enrollmentDate: string;
  } | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      alert('ID inválido');
      this.router.navigate(['/enrollments']);
      return;
    }

    this.enrollmentService.getById(id).subscribe(e => {
      if (!e) {
        alert('Matrícula não encontrada');
        this.router.navigate(['/enrollments']);
        return;
      }

      // Buscar nomes do aluno e da turma
      let studentName: string | null = null;
      let classRoomName: string | null = null;

      this.studentService.getById(e.studentId).subscribe(s => studentName = s?.name ?? 'Aluno não informado');
      this.classRoomService.getById(e.classRoomId).subscribe(c => classRoomName = c?.name ?? 'Turma não informada');

      this.enrollment = {
        id: e.id,
        studentName,
        classRoomName,
        status: e.status ?? '-',
        enrollmentDate: e.enrollmentDate,
      };
    });
  }

  edit() {
    if (this.enrollment) {
      this.router.navigate([`/enrollments/edit/${this.enrollment.id}`]);
    }
  }

  back() {
    this.router.navigate(['/enrollments']);
  }
}
