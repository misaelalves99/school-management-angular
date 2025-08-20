// src/pages/subjects/create/create-subject.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Subject {
  name: string;
  description: string;
}

@Component({
  selector: 'app-create-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent {
  subject: Subject = { name: '', description: '' };
  errors: { name?: string } = {};

  constructor(private router: Router) {}

  handleChange(field: keyof Subject, value: string) {
    this.subject[field] = value;
  }

  validate(): boolean {
    this.errors = {};
    if (!this.subject.name.trim()) {
      this.errors.name = 'O nome da disciplina é obrigatório.';
    }
    return Object.keys(this.errors).length === 0;
  }

  handleSubmit() {
    if (!this.validate()) return;
    console.log('Salvar:', this.subject); // Aqui faria a chamada à API
    this.router.navigate(['/subjects']);
  }

  goBack() {
    this.router.navigate(['/subjects']);
  }
}
