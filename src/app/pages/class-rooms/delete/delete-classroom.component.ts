// src/pages/class-rooms/delete/delete-classroom.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClassRoomService } from '../../../services/classroom.service';
import { ClassRoom } from '../../../types/classroom.model';
import { Subject } from '../../../types/subject.model';

@Component({
  selector: 'app-delete-classroom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-classroom.component.html',
  styleUrls: ['./delete-classroom.component.css']
})
export class DeleteClassroomComponent implements OnInit {
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  classRoom: ClassRoom | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.classRoomService.getById(id).subscribe(cr => {
      this.classRoom = cr ?? null;
    });
  }

  getSubjectNames(subjects: Subject[] = []): string {
    return subjects.length ? subjects.map(s => s.name).join(', ') : 'Nenhuma';
  }

  handleDelete(): void {
    if (!this.classRoom) return;

    if (confirm(`Confirma exclusão da sala: ${this.classRoom.name}?`)) {
      this.classRoomService.delete(this.classRoom.id);
      this.router.navigate(['/classrooms']);
    }
  }

  cancel(): void {
    this.router.navigate(['/classrooms']);
  }
}
