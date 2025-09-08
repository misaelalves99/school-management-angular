// src/pages/enrollments/edit/edit-enrollment.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentService, Enrollment, EnrollmentForm } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';

interface ValidationErrors {
  studentId?: string;
  classRoomId?: string;
  enrollmentDate?: string;
  status?: string;
}

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
  
  formData: EnrollmentForm & { id: number; status: 'Ativo' | 'Inativo' } = {
    id: 0,
    studentId: 0,
    classRoomId: 0,
    enrollmentDate: '',
    status: 'Ativo'
  };

  errors: ValidationErrors = {};

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
      this.enrollment = e;
      this.formData = { ...e }; // Inicializa o formData corretamente
    });

    this.studentService.getAll().subscribe(students => this.students = students);
    this.classRoomService.getAll().subscribe(classRooms => this.classRooms = classRooms);
  }

  validate(): boolean {
    const newErrors: ValidationErrors = {};
    if (!this.formData.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!this.formData.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!this.formData.enrollmentDate) newErrors.enrollmentDate = 'Data é obrigatória.';
    if (!this.formData.status) newErrors.status = 'Status é obrigatório.';
    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit(): void {
    if (!this.validate()) return;

    this.enrollmentService.update(this.formData as Enrollment).subscribe(() => {
      this.router.navigate(['/enrollments']);
    });
  }

  back(): void {
    this.router.navigate(['/enrollments']);
  }
}
