// src/pages/subjects/subjects-index.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from '../../types/subject.model';
import { SubjectService } from '../../services/subject.service';

const PAGE_SIZE = 2;

@Component({
  selector: 'app-subjects-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './subjects-index.component.html',
  styleUrls: ['./subjects-index.component.css'],
})
export class SubjectsIndexComponent implements OnInit {
  private subjectService = inject(SubjectService);

  subjects: Subject[] = [];
  search = '';
  page = 1;

  ngOnInit(): void {
    this.subjectService.getAll().subscribe(subjects => {
      this.subjects = subjects;
      this.page = 1;
    });
  }

  get filtered(): Subject[] {
    const term = this.search.toLowerCase();
    return this.subjects.filter(
      s => s.name.toLowerCase().includes(term) || s.description.toLowerCase().includes(term)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / PAGE_SIZE) || 1;
  }

  get paginated(): Subject[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  }

  goToPrevious() {
    if (this.page > 1) this.page--;
  }

  goToNext() {
    if (this.page < this.totalPages) this.page++;
  }

  resetPage() {
    this.page = 1;
  }
}
