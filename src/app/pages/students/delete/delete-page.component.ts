// src/pages/students/delete/delete-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-delete-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-page.component.html',
  styleUrls: ['./delete-page.component.css'],
})
export class DeleteStudentComponent {
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  handleDelete() {
    if (!this.id) return;

    const studentId = Number(this.id);
    this.studentService.delete(studentId); // remove o aluno do service
    alert(`Aluno ${this.id} excluído!`);
    this.router.navigate(['/students']);
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}
