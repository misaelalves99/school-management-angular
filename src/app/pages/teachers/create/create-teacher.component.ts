// src/pages/teachers/create/create-teacher.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../types/subject.model';
import { TeacherFormData } from '../../../types/teacher.model';

@Component({
  selector: 'app-create-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.css'],
})
export class CreateTeacherComponent implements OnInit {
  formData: {
    name: string;
    email: string;
    dateOfBirth: string;
    subject: string;
    phone: string;
    address: string;
  } = {
    name: '',
    email: '',
    dateOfBirth: '',
    subject: '',
    phone: '',
    address: '',
  };

  errors: Partial<Record<keyof typeof this.formData, string>> = {};

  subjects: Subject[] = [];

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getAll().subscribe((data) => {
      this.subjects = data;
    });
  }

  validate(): boolean {
    const newErrors: Partial<Record<keyof typeof this.formData, string>> = {};

    if (!this.formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!this.formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(this.formData.email)) newErrors.email = 'Email inválido.';
    if (!this.formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!this.formData.subject) newErrors.subject = 'Disciplina é obrigatória.';

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit() {
    if (!this.validate()) return;

    const subjectId = Number(this.formData.subject);
    const payload: TeacherFormData = {
      ...this.formData,
      subject: this.getSubjectName(subjectId),
    };

    this.teacherService.create(payload).subscribe({
      next: () => {
        alert('Professor cadastrado com sucesso!');
        this.router.navigate(['/teachers']);
      },
      error: (err) => alert('Erro ao cadastrar professor: ' + err.message),
    });
  }

  getSubjectName(id: number): string {
    const subj = this.subjects.find((s) => s.id === id);
    return subj ? subj.name : '';
  }

  goBack() {
    this.router.navigate(['/teachers']);
  }
}
