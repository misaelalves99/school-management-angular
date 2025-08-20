// src/pages/teachers/create/create-teacher.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';

export interface TeacherFormData {
  name: string;
  email: string;
  dateOfBirth: string;
  subject: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-create-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.css'],
})
export class CreateTeacherComponent {
  private teacherService = inject(TeacherService);
  private router = inject(Router);

  formData: TeacherFormData = {
    name: '',
    email: '',
    dateOfBirth: '',
    subject: '',
    phone: '',
    address: '',
  };

  errors: Partial<Record<keyof TeacherFormData, string>> = {};

  // Definindo os campos no TS para evitar problemas de indexação
  fields: { label: string; name: keyof TeacherFormData; type: string }[] = [
    { label: 'Nome', name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Data de Nascimento', name: 'dateOfBirth', type: 'date' },
    { label: 'Disciplina', name: 'subject', type: 'text' },
    { label: 'Telefone', name: 'phone', type: 'tel' },
    { label: 'Endereço', name: 'address', type: 'text' },
  ];

  validate(): boolean {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};

    if (!this.formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!this.formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(this.formData.email)) newErrors.email = 'Email inválido.';
    if (!this.formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!this.formData.subject.trim()) newErrors.subject = 'Disciplina é obrigatória.';

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit(): void {
    if (!this.validate()) return;

    this.teacherService.create(this.formData).subscribe({
      next: () => {
        alert('Professor salvo com sucesso!');
        this.router.navigate(['/teachers']);
      },
      error: (err) => {
        alert('Erro ao salvar professor: ' + err.message);
      },
    });
  }
}
