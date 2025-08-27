// src/pages/subjects/create/create-subject.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../types/subject.model';

@Component({
  selector: 'app-create-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent {
  subject: Omit<Subject, 'id'> = { name: '', description: '', workloadHours: 60 };
  errors: { name?: string; workloadHours?: string } = {};

  constructor(private router: Router, private subjectService: SubjectService) {}

  handleChange<K extends keyof Omit<Subject, 'id'>>(field: K, value: string | number) {
    if (field === 'workloadHours') {
      this.subject[field] = Number(value) as any; // workloadHours é number
    } else {
      this.subject[field] = value as string as any; // name/description são strings
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.subject.name.trim()) {
      this.errors.name = 'O nome da disciplina é obrigatório.';
    }
    if (!this.subject.workloadHours || this.subject.workloadHours <= 0) {
      this.errors.workloadHours = 'A carga horária deve ser maior que 0.';
    }
    return Object.keys(this.errors).length === 0;
  }

  handleSubmit() {
    if (!this.validate()) return;

    this.subjectService.add(this.subject); // Salva via serviço
    this.router.navigate(['/subjects']);
  }

  goBack() {
    this.router.navigate(['/subjects']);
  }
}
