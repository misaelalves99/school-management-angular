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

const PAGE_SIZE = 2;

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
  currentPage = 1;
  data: {
    items: Enrollment[];
    currentPage: number;
    totalItems: number;
    pageSize: number;
    searchTerm: string;
  } = {
    items: [],
    currentPage: 1,
    totalItems: 0,
    pageSize: PAGE_SIZE,
    searchTerm: '',
  };

  students: Student[] = [];
  classRooms: ClassRoom[] = [];
  enrollments: Enrollment[] = [];

  ngOnInit(): void {
    // Carregar dados de students, classrooms e enrollments via services
    this.studentService.getAll().subscribe(s => this.students = s);
    this.classRoomService.getAll().subscribe(c => this.classRooms = c);
    this.enrollmentService.getAll().subscribe(e => {
      this.enrollments = e;
      this.loadData();
    });
  }

  loadData() {
    let filtered = this.enrollments;

    if (this.searchString) {
      const lowerSearch = this.searchString.toLowerCase();
      filtered = filtered.filter(e => e.status.toLowerCase().includes(lowerSearch));
    }

    const start = (this.currentPage - 1) * PAGE_SIZE;
    const paginatedItems = filtered.slice(start, start + PAGE_SIZE);

    this.data = {
      items: paginatedItems,
      currentPage: this.currentPage,
      totalItems: filtered.length,
      pageSize: PAGE_SIZE,
      searchTerm: this.searchString,
    };
  }

  get totalPages(): number {
    return Math.ceil(this.data.totalItems / this.data.pageSize);
  }

  getStudentName(id: number): string {
    return this.students.find(s => s.id === id)?.name ?? 'Aluno não informado';
  }

  getClassRoomName(id: number): string {
    return this.classRooms.find(c => c.id === id)?.name ?? 'Turma não informada';
  }

  search() {
    this.currentPage = 1;
    this.loadData();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadData();
  }
}
