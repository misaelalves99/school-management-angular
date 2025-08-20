// src/pages/teachers/delete/delete-teacher.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../types/teacher.model';

@Component({
  selector: 'app-delete-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-teacher.component.html',
  styleUrls: ['./delete-teacher.component.css'],
})
export class DeleteTeacherComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  teacher: Teacher | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      alert('ID inválido');
      this.router.navigate(['/teachers']);
      return;
    }

    this.teacherService.getById(id).subscribe({
      next: (t) => {
        if (!t) {
          alert('Professor não encontrado.');
          this.router.navigate(['/teachers']);
          return;
        }
        this.teacher = t;
      },
      error: () => {
        alert('Erro ao carregar professor.');
        this.router.navigate(['/teachers']);
      },
    });
  }

  handleDelete(): void {
    if (!this.teacher) return;

    if (confirm(`Confirma exclusão do professor: ${this.teacher.name}?`)) {
      this.teacherService.delete(this.teacher.id).subscribe({
        next: () => {
          alert('Professor excluído com sucesso.');
          this.router.navigate(['/teachers']);
        },
        error: (err) => {
          alert('Erro ao excluir professor: ' + err.message);
        },
      });
    }
  }

  handleCancel(): void {
    this.router.navigate(['/teachers']);
  }
}
