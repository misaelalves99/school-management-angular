// src/pages/subjects/edit/edit-subject.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Subject {
  id: number;
  name: string;
  description: string;
}

// Mock de disciplina
const mockSubject: Subject = {
  id: 1,
  name: 'Matemática',
  description: 'Disciplina de matemática básica',
};

@Component({
  selector: 'app-edit-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css'],
})
export class EditSubjectComponent {
  subject: Subject = { id: 0, name: '', description: '' };
  errors: { name?: string } = {};

  constructor(private route: ActivatedRoute, private router: Router) {
    const idParam = this.route.snapshot.paramMap.get('id');
    // Simula fetch de disciplina pelo id
    this.subject = mockSubject;
  }

  validate(): boolean {
    const newErrors: { name?: string } = {};
    if (!this.subject.name.trim()) newErrors.name = 'O nome da disciplina é obrigatório.';
    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit() {
    if (!this.validate()) return;
    console.log('Salvar alterações:', this.subject);
    this.router.navigate(['/subjects']);
  }

  back() {
    this.router.navigate(['/subjects']);
  }
}
