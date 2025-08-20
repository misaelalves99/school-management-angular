// src/pages/students/edit/edit-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Student {
  id?: string;
  name: string;
  email: string;
  dateOfBirth: string;
  enrollmentNumber: string;
  phone: string;
  address: string;
}

// Mock simples de dados para exemplo
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    dateOfBirth: '2000-01-01',
    enrollmentNumber: '20230001',
    phone: '123456789',
    address: 'Rua A',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    dateOfBirth: '1999-05-15',
    enrollmentNumber: '20230002',
    phone: '987654321',
    address: 'Rua B',
  },
];

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css'],
})
export class EditStudentComponent {
  id: string | null = null;
  formData: Student = {
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadStudent();
  }

  loadStudent() {
    if (!this.id) {
      alert('ID do aluno não fornecido.');
      this.router.navigate(['/students']);
      return;
    }

    const student = mockStudents.find((s) => s.id === this.id);
    if (!student) {
      alert('Aluno não encontrado.');
      this.router.navigate(['/students']);
      return;
    }

    this.formData = { ...student };
  }

  handleSubmit() {
    // TODO: salvar aluno editado via API ou state global
    alert('Aluno atualizado!');
    this.router.navigate(['/students']);
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}
