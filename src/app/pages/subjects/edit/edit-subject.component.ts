// src/pages/subjects/edit/edit-subject.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from '../../../types/subject.model';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-edit-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css'],
})
export class EditSubjectComponent implements OnInit {
  subject: Subject = { id: 0, name: '', description: '', workloadHours: 1 };
  errors: { name?: string; workloadHours?: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const subjectId = idParam ? Number(idParam) : null;

    if (!subjectId) {
      alert('ID inválido');
      this.router.navigate(['/subjects']);
      return;
    }

    this.subjectService.getById(subjectId).subscribe(s => {
      if (!s) {
        alert('Disciplina não encontrada');
        this.router.navigate(['/subjects']);
        return;
      }
      this.subject = { ...s };
    });
  }

  validate(): boolean {
    this.errors = {};
    if (!this.subject.name.trim()) {
      this.errors.name = 'O nome da disciplina é obrigatório.';
    }
    if (!this.subject.workloadHours || this.subject.workloadHours <= 0) {
      this.errors.workloadHours = 'A carga horária deve ser maior que zero.';
    }
    return Object.keys(this.errors).length === 0;
  }

  handleSubmit(): void {
    if (!this.validate()) return;

    this.subjectService.update(this.subject.id, this.subject).subscribe(() => {
      this.router.navigate(['/subjects']);
    });
  }

  back(): void {
    this.router.navigate(['/subjects']);
  }
}
