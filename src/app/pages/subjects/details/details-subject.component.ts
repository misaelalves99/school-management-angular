// src/pages/subjects/details/details-subject.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../types/subject.model';

@Component({
  selector: 'app-details-subject',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-subject.component.html',
  styleUrls: ['./details-subject.component.css'],
})
export class DetailsSubjectComponent implements OnInit {
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  subject?: Subject;

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
      this.subject = s;
    });
  }

  edit(): void {
    if (this.subject) {
      this.router.navigate([`/subjects/edit/${this.subject.id}`]);
    }
  }

  back(): void {
    this.router.navigate(['/subjects']);
  }
}
