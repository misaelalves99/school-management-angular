// src/pages/subjects/delete/delete-subject.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../types/subject.model';

@Component({
  selector: 'app-delete-subject',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-subject.component.html',
  styleUrls: ['./delete-subject.component.css'],
})
export class DeleteSubjectComponent implements OnInit {
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  subject: Subject | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      alert('ID da disciplina inválido.');
      this.router.navigate(['/subjects']);
      return;
    }

    this.subjectService.getById(id).subscribe({
      next: (s) => {
        if (!s) {
          alert('Disciplina não encontrada.');
          this.router.navigate(['/subjects']);
          return;
        }
        this.subject = s;
      },
      error: () => {
        alert('Erro ao carregar disciplina.');
        this.router.navigate(['/subjects']);
      },
    });
  }

  handleDelete(): void {
    if (!this.subject) return;

    if (confirm(`Tem certeza que deseja excluir a disciplina: ${this.subject.name}?`)) {
      this.subjectService.delete(this.subject.id);
      alert('Disciplina excluída com sucesso.');
      this.router.navigate(['/subjects']);
    }
  }

  cancel(): void {
    this.router.navigate(['/subjects']);
  }
}
