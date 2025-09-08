// src/pages/students/details/details-page.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../types/student.model';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css'],
})
export class StudentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);

  id: number | null = null;
  student: Student | null = null;

  ngOnInit() {
    // pega o ID da rota
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = paramId ? Number(paramId) : null;

    if (!this.id) {
      alert('ID inválido');
      this.router.navigate(['/students']);
      return;
    }

    // busca pelo service
    this.studentService.getById(this.id).subscribe(s => {
      if (!s) {
        alert('Aluno não encontrado');
        this.router.navigate(['/students']);
        return;
      }
      this.student = s;
    });
  }

  edit() {
    if (this.id) {
      this.router.navigate([`/students/edit/${this.id}`]);
    }
  }

  back() {
    this.router.navigate(['/students']);
  }
}
