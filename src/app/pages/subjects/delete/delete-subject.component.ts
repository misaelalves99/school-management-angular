// src/pages/subjects/delete/delete-subject.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-subject',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-subject.component.html',
  styleUrls: ['./delete-subject.component.css']
})
export class DeleteSubjectComponent {
  subjectId: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.subjectId = this.route.snapshot.paramMap.get('id');
  }

  handleDelete() {
    console.log('Excluir disciplina com ID:', this.subjectId); // Aqui faria a chamada à API
    this.router.navigate(['/subjects']);
  }

  cancel() {
    this.router.navigate(['/subjects']);
  }
}
