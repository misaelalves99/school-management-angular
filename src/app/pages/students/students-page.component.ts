// src/pages/students/students-page.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService, StudentFormData } from '../../services/student.service';
import { Student } from '../../types/student.model';

// Mock inicial (agora com todos os campos de Student)
export const mockStudents: Student[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    dateOfBirth: '2000-05-10',
    enrollmentNumber: '20230001',
    phone: '123456789',
    address: 'Rua A, 123',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    dateOfBirth: '2001-08-22',
    enrollmentNumber: '20230002',
    phone: '987654321',
    address: 'Rua B, 456',
  },
  {
    id: 3,
    name: 'Carlos Santos',
    email: 'carlos.santos@example.com',
    dateOfBirth: '1999-12-15',
    enrollmentNumber: '20230003',
    phone: '456789123',
    address: 'Rua C, 789',
  },
];

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css'],
})
export class StudentsPageComponent implements OnInit {
  private studentService = inject(StudentService);

  students: Student[] = [];
  search: string = '';

  ngOnInit() {
    // Inicializa o service com os alunos do mock se estiver vazio
    this.studentService.getAll().subscribe(list => {
      if (list.length === 0) {
        mockStudents.forEach(s => {
          const { id, ...data } = s; // remove o id para passar como StudentFormData
          this.studentService.create(data as StudentFormData).subscribe();
        });
      }
    });

    // Atualiza a lista local sempre que houver mudanças no service
    this.studentService.getAll().subscribe(students => {
      this.students = students;
      this.applySearch();
    });
  }

  onSearch() {
    this.applySearch();
  }

  private applySearch() {
    const term = this.search.toLowerCase();
    const allStudents = this.studentService.snapshot();
    this.students = allStudents.filter(s =>
      s.name.toLowerCase().includes(term)
    );
  }
}
