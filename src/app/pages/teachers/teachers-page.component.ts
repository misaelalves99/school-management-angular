// src/pages/teachers/teachers-page.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../types/teacher.model';

@Component({
  selector: 'app-teachers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teachers-page.component.html',
  styleUrls: ['./teachers-page.component.css'],
})
export class TeachersPageComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private router = inject(Router);

  searchTerm = '';
  allTeachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (teachers) => {
        this.allTeachers = teachers;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        alert('Erro ao carregar professores.');
        this.loading = false;
      },
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredTeachers = term
      ? this.allTeachers.filter(
          (t) => t.name.toLowerCase().includes(term) || t.subject.toLowerCase().includes(term)
        )
      : this.allTeachers;
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
