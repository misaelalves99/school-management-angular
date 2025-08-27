// src/pages/class-rooms/details/details-classroom.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClassRoomService } from '../../../services/classroom.service';
import { ClassRoom } from '../../../types/classroom.model';

@Component({
  selector: 'app-details-classroom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-classroom.component.html',
  styleUrls: ['./details-classroom.component.css']
})
export class DetailsClassroomComponent implements OnInit {
  private classRoomService = inject(ClassRoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  classRoom: ClassRoom | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      alert('ID da sala inválido');
      this.router.navigate(['/classrooms']);
      return;
    }

    this.classRoomService.getById(id).subscribe(cr => {
      if (!cr) {
        alert('Sala não encontrada');
        this.router.navigate(['/classrooms']);
        return;
      }
      this.classRoom = cr;
    });
  }
}
