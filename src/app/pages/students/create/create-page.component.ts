// src/pages/students/create/create-page.component.ts

// src/pages/students/create/create-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { StudentService, StudentFormData } from '../../../services/student.service';
import { Student } from '../../../types/student.model';

@Component({
  selector: 'app-create-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css'],
})
export class CreateStudentComponent {
  student: StudentFormData = {
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  };

  errors: Partial<Record<keyof Student, string>> = {};

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {}

  validate(): boolean {
    this.errors = {};
    if (!this.student.name) this.errors.name = 'Nome é obrigatório.';
    if (!this.student.email) this.errors.email = 'Email é obrigatório.';
    if (!this.student.dateOfBirth) this.errors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!this.student.enrollmentNumber) this.errors.enrollmentNumber = 'Matrícula é obrigatória.';
    return Object.keys(this.errors).length === 0;
  }

  onSubmit(form: NgForm) {
    if (!this.validate()) return;

    this.studentService.create(this.student).subscribe(() => {
      alert('Aluno cadastrado com sucesso!');
      this.router.navigate(['/students']);
    });
  }

  goBack() {
    this.router.navigate(['/students']);
  }
}
