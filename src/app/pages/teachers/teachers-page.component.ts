// src/pages/teachers/teachers-page.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../types/teacher.model';

const PAGE_SIZE = 2;

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
  currentPage = 1;
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

    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTeachers.length / PAGE_SIZE) || 1;
  }

  get currentItems(): Teacher[] {
    const start = (this.currentPage - 1) * PAGE_SIZE;
    return this.filteredTeachers.slice(start, start + PAGE_SIZE);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
