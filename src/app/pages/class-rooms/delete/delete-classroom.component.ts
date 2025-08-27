// src/pages/class-rooms/delete/delete-classroom.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClassRoomService } from '../../../services/classroom.service';
import { ClassRoom } from '../../../types/classroom.model';
import { Subject } from '../../../types/subject.model';

@Component({
  selector: 'app-delete-classroom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-classroom.component.html',
  styleUrls: ['./delete-classroom.component.css'],
})
export class DeleteClassroomComponent implements OnInit {
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  classRoom: ClassRoom | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      alert('ID inválido');
      this.router.navigate(['/classrooms']);
      return;
    }

    this.classRoomService.getById(id).subscribe({
      next: (cr) => {
        if (!cr) {
          alert('Sala não encontrada.');
          this.router.navigate(['/classrooms']);
          return;
        }
        this.classRoom = cr;
      },
      error: () => {
        alert('Erro ao carregar a sala.');
        this.router.navigate(['/classrooms']);
      },
    });
  }

  getSubjectNames(subjects: Subject[] = []): string {
    return subjects.length ? subjects.map(s => s.name).join(', ') : 'Nenhuma';
  }

  handleDelete(): void {
    if (!this.classRoom) return;

    if (confirm(`Confirma exclusão da sala: ${this.classRoom.name}?`)) {
      this.classRoomService.delete(this.classRoom.id);
      alert('Sala excluída com sucesso!');
      this.router.navigate(['/classrooms']);
    }
  }

  cancel(): void {
    this.router.navigate(['/classrooms']);
  }
}
