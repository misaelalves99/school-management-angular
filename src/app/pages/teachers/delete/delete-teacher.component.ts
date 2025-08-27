// src/pages/teachers/delete/delete-teacher.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../types/teacher.model';
import { take } from 'rxjs/operators';

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
  loading = true;
  deleting = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam !== null ? Number(idParam) : NaN;

    if (isNaN(id) || id <= 0) {
      alert('ID inválido.');
      this.router.navigate(['/teachers']);
      return;
    }

    // Carrega o professor uma vez
    this.teacherService.getById(id).pipe(take(1)).subscribe({
      next: (t) => {
        if (!t) {
          alert('Professor não encontrado.');
          this.router.navigate(['/teachers']);
          return;
        }
        this.teacher = t;
        this.loading = false;
      },
      error: () => {
        alert('Erro ao carregar professor.');
        this.router.navigate(['/teachers']);
      },
    });
  }

  handleDelete(): void {
    if (!this.teacher) return;

    const confirmed = confirm(`Confirma exclusão do professor: ${this.teacher.name}?`);
    if (!confirmed) return;

    this.deleting = true;

    this.teacherService.delete(this.teacher.id).pipe(take(1)).subscribe({
      next: () => {
        this.deleting = false;
        alert('Professor excluído com sucesso.');
        this.router.navigate(['/teachers']);
      },
      error: (err) => {
        this.deleting = false;
        alert('Erro ao excluir professor: ' + (err?.message ?? err));
      },
    });
  }

  handleCancel(): void {
    if (this.deleting) return;
    this.router.navigate(['/teachers']);
  }
}
