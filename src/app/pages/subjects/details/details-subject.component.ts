// src/pages/subjects/details/details-subject.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface Subject {
  id: number;
  name: string;
  workloadHours: number;
}

// Mock de várias disciplinas
const mockSubjects: Subject[] = [
  { id: 1, name: 'Matemática', workloadHours: 60 },
  { id: 2, name: 'Física', workloadHours: 60 },
  { id: 3, name: 'Química', workloadHours: 60 },
];

@Component({
  selector: 'app-details-subject',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-subject.component.html',
  styleUrls: ['./details-subject.component.css'],
})
export class DetailsSubjectComponent {
  subject: Subject | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {
    const idParam = this.route.snapshot.paramMap.get('id');
    const subjectId = idParam ? Number(idParam) : null;
    if (subjectId !== null) {
      this.subject = mockSubjects.find(s => s.id === subjectId);
    }
  }

  edit() {
    if (this.subject) {
      this.router.navigate([`/subjects/edit/${this.subject.id}`]);
    }
  }

  back() {
    this.router.navigate(['/subjects']);
  }
}
