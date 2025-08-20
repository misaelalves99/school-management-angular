// src/pages/students/delete/delete-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-page.component.html',
  styleUrls: ['./delete-page.component.css'],
})
export class DeleteStudentComponent {
  id: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  handleDelete() {
    // TODO: API call para deletar aluno
    alert(`Aluno ${this.id} excluído!`);
    this.router.navigate(['/students']);
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}
