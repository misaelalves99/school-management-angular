// src/pages/enrollments/enrollment-index.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { ClassRoomService } from '../../services/classroom.service';
import { Enrollment } from '../../types/enrollment.model';
import { Student } from '../../types/student.model';
import { ClassRoom } from '../../types/classroom.model';

@Component({
  selector: 'app-enrollment-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './enrollment-index.component.html',
  styleUrls: ['./enrollment-index.component.css'],
})
export class EnrollmentIndexComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);

  searchString = '';

  students: Student[] = [];
  classRooms: ClassRoom[] = [];
  enrollments: Enrollment[] = [];

  ngOnInit(): void {
    this.studentService.getAll().subscribe(s => this.students = s);
    this.classRoomService.getAll().subscribe(c => this.classRooms = c);
    this.enrollmentService.getAll().subscribe(e => this.enrollments = e);
  }

  get filteredEnrollments(): Enrollment[] {
    const term = this.searchString.toLowerCase();
    return this.enrollments.filter(e =>
      e.status.toLowerCase().includes(term)
    );
  }

  getStudentName(id: number): string {
    return this.students.find(s => s.id === id)?.name ?? 'Aluno não informado';
  }

  getClassRoomName(id: number): string {
    return this.classRooms.find(c => c.id === id)?.name ?? 'Turma não informada';
  }
}
