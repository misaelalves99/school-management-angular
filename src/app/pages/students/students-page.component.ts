// src/pages/students/students-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Mock simples de dados
export const mockStudents = [
  { id: 1, name: 'João Silva', enrollmentNumber: '20230001', phone: '123456789', address: 'Rua A' },
  { id: 2, name: 'Maria Oliveira', enrollmentNumber: '20230002', phone: '987654321', address: 'Rua B' },
  { id: 3, name: 'Carlos Santos', enrollmentNumber: '20230003', phone: '456789123', address: 'Rua C' },
  // ...adicione mais alunos conforme necessário
];

interface Student {
  id: number;
  name: string;
  email?: string;
  dateOfBirth?: string;
  enrollmentNumber: string;
  phone?: string;
  address?: string;
}

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css']
})
export class StudentsPageComponent {
  students: Student[] = [];
  search: string = '';
  page: number = 1;
  totalPages: number = 1;

  pageSize = 10;

  constructor() {
    this.updateStudents();
  }

  updateStudents() {
    const filtered = mockStudents.filter(s =>
      s.name.toLowerCase().includes(this.search.toLowerCase())
    );
    const start = (this.page - 1) * this.pageSize;
    this.students = filtered.slice(start, start + this.pageSize);
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
  }

  onSearch() {
    this.page = 1;
    this.updateStudents();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updateStudents();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateStudents();
    }
  }
}
