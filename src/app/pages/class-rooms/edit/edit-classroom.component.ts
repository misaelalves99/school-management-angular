// src/pages/class-rooms/edit/edit-classroom.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClassRoomService } from '../../../services/classroom.service';
import { ClassRoom } from '../../../types/classroom.model';

@Component({
  selector: 'app-edit-classroom',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-classroom.component.html',
  styleUrls: ['./edit-classroom.component.css'],
})
export class EditClassroomComponent implements OnInit {
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  classRoom: ClassRoom | null = null;
  formData: Partial<ClassRoom> = {};

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
        this.formData = { ...cr }; // Preenche o formulário
      },
      error: () => {
        alert('Erro ao carregar a sala.');
        this.router.navigate(['/classrooms']);
      },
    });
  }

  handleSubmit(): void {
    if (!this.classRoom) return;

    // Atualiza a sala no service
    const updated: ClassRoom = { ...this.classRoom, ...this.formData } as ClassRoom;
    this.classRoomService.update(updated);

    alert('Sala atualizada com sucesso!');
    this.router.navigate(['/classrooms']);
  }

  cancel(): void {
    this.router.navigate(['/classrooms']);
  }
}
