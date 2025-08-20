// src/pages/teachers/details/details-teacher.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../types/teacher.model';

@Component({
  selector: 'app-details-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-teacher.component.html',
  styleUrls: ['./details-teacher.component.css'],
})
export class DetailsTeacherComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  teacher: Teacher | null = null;
  formattedDate = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      alert('ID inválido');
      this.router.navigate(['/teachers']);
      return;
    }

    this.teacherService.getById(Number(idParam)).subscribe({
      next: (found) => {
        if (!found) {
          alert('Professor não encontrado.');
          this.router.navigate(['/teachers']);
          return;
        }
        this.teacher = found;
        this.formattedDate = new Date(found.dateOfBirth).toLocaleDateString();
      },
      error: () => {
        alert('Erro ao carregar professor.');
        this.router.navigate(['/teachers']);
      },
    });
  }

  editTeacher(): void {
    if (!this.teacher) return;
    this.router.navigate([`/teachers/edit/${this.teacher.id}`]);
  }

  goBack(): void {
    this.router.navigate(['/teachers']);
  }
}
