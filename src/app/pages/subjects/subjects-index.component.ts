// src/pages/subjects/subjects-index.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from '../../types/subject.model';
import { SubjectService } from '../../services/subject.service';

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

  ngOnInit(): void {
    this.subjectService.getAll().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  get filtered(): Subject[] {
    const term = this.search.toLowerCase();
    return this.subjects.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
  }
}
