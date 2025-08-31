// src/pages/teachers/edit/edit-teacher.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { SubjectService } from '../../../services/subject.service';
import { TeacherFormData } from '../../../types/teacher.model';
import { Subject } from '../../../types/subject.model';

@Component({
  selector: 'app-edit-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css'],
})
export class EditTeacherComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private subjectService = inject(SubjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = true;
  teacherId!: number;

  subjects: Subject[] = [];

  formData: TeacherFormData = {
    name: '',
    email: '',
    dateOfBirth: '',
    subject: '',
    phone: '',
    address: '',
    photoUrl: '',
  };

  errors: Partial<Record<keyof TeacherFormData, string>> = {};

  ngOnInit(): void {
    this.teacherId = Number(this.route.snapshot.paramMap.get('id'));

    // Carregar disciplinas
    this.subjectService.getAll().subscribe((data) => (this.subjects = data));

    this.teacherService.getById(this.teacherId).subscribe({
      next: (teacher) => {
        if (!teacher) {
          alert('Professor não encontrado.');
          this.router.navigate(['/teachers']);
          return;
        }
        const { id, ...rest } = teacher;
        this.formData = { ...rest };
        this.loading = false;
      },
      error: () => {
        alert('Erro ao carregar professor.');
        this.router.navigate(['/teachers']);
      },
    });
  }

  validate(): boolean {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};

    if (!this.formData.name?.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!this.formData.email?.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(this.formData.email))
      newErrors.email = 'Email inválido.';
    if (!this.formData.dateOfBirth)
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!this.formData.subject?.trim())
      newErrors.subject = 'Disciplina é obrigatória.';

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit(): void {
    if (!this.validate()) return;

    this.teacherService.update(this.teacherId, this.formData).subscribe({
      next: () => {
        alert('Professor atualizado com sucesso!');
        this.router.navigate(['/teachers']);
      },
      error: (err) => {
        alert('Erro ao atualizar professor: ' + err.message);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/teachers']);
  }
}
