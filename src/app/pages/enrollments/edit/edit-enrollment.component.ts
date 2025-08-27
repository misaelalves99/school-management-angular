// src/pages/enrollments/edit/edit-enrollment.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentService, Enrollment } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';

@Component({
  selector: 'app-edit-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-enrollment.component.html',
  styleUrls: ['./edit-enrollment.component.css'],
})
export class EditEnrollmentComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  enrollment!: Enrollment;
  students: Student[] = [];
  classRooms: ClassRoom[] = [];

  formData!: Enrollment;
  errors: { studentId?: string; classRoomId?: string; enrollmentDate?: string } = {};

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
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
      this.enrollment = e;
      this.formData = { ...e };
    });

    // Carregar alunos e salas
    this.studentService.getAll().subscribe(students => this.students = students);
    this.classRoomService.getAll().subscribe(classRooms => this.classRooms = classRooms);
  }

  handleSubmit(): void {
    this.errors = {};
    if (!this.formData.studentId) this.errors.studentId = 'Aluno é obrigatório.';
    if (!this.formData.classRoomId) this.errors.classRoomId = 'Turma é obrigatória.';
    if (!this.formData.enrollmentDate) this.errors.enrollmentDate = 'Data é obrigatória.';

    if (Object.keys(this.errors).length > 0) return;

    this.enrollmentService.update(this.formData);
    this.router.navigate(['/enrollments']);
  }

  back(): void {
    this.router.navigate(['/enrollments']);
  }
}
