// src/pages/enrollments/create/create-enrollment.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../services/enrollment.service';
import { Student } from '../../../types/student.model';
import { ClassRoom } from '../../../types/classroom.model';
import { StudentService } from '../../../services/student.service';
import { ClassRoomService } from '../../../services/classroom.service';

interface ValidationErrors {
  studentId?: string;
  classRoomId?: string;
  enrollmentDate?: string;
  status?: string;
}

@Component({
  selector: 'app-create-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-enrollment.component.html',
  styleUrls: ['./create-enrollment.component.css'],
})
export class CreateEnrollmentComponent {
  students: Student[] = [];
  classRooms: ClassRoom[] = [];

  form: Partial<Enrollment> = {
    studentId: undefined,
    classRoomId: undefined,
    enrollmentDate: new Date().toISOString().slice(0, 10),
    status: 'Ativo',
  };

  errors: ValidationErrors = {};

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private classRoomService: ClassRoomService,
    private router: Router
  ) {
    this.loadStudents();
    this.loadClassRooms();
  }

  loadStudents() {
    this.studentService.getAll().subscribe((data) => {
      this.students = data;
    });
  }

  loadClassRooms() {
    this.classRoomService.getAll().subscribe((data) => {
      this.classRooms = data;
    });
  }

  validate(): boolean {
    const newErrors: ValidationErrors = {};
    if (!this.form.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!this.form.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!this.form.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';
    if (!this.form.status) newErrors.status = 'Status é obrigatório.';
    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit() {
    if (!this.validate()) return;

    const newEnrollment: Enrollment = {
      id: Math.floor(Math.random() * 10000),
      studentId: Number(this.form.studentId),
      classRoomId: Number(this.form.classRoomId),
      enrollmentDate: this.form.enrollmentDate!,
      status: this.form.status!,
    };

    this.enrollmentService.add(newEnrollment);
    this.router.navigate(['/enrollments']);
  }

  goBack() {
    this.router.navigate(['/enrollments']);
  }
}
