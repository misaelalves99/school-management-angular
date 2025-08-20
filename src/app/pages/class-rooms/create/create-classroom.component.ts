// /src/pages/class-rooms/create/create-classroom.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClassRoomService } from '../../../services/classroom.service';
import { ClassRoom } from '../../../types/classroom.model';

@Component({
  selector: 'app-create-classroom',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-classroom.component.html',
  styleUrls: ['./create-classroom.component.css'],
})
export class CreateClassroomComponent {
  name = '';
  capacity: number | null = null;
  schedule = '';

  constructor(private classRoomService: ClassRoomService, private router: Router) {}

  handleSubmit(): void {
    if (!this.name || !this.capacity || !this.schedule) return;

    const newClassRoom: ClassRoom = {
      id: 0, // o service pode gerar o ID real se quiser
      name: this.name,
      capacity: this.capacity,
      schedule: this.schedule,
      subjects: [],       // ✅ obrigatório
      classTeacher: undefined, // opcional
      teachers: []        // opcional
    };

    this.classRoomService.add(newClassRoom);

    this.router.navigate(['/classrooms']);
  }

  cancel(): void {
    this.router.navigate(['/classrooms']);
  }
}
