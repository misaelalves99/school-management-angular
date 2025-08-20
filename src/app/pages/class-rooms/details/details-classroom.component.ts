// src/pages/class-rooms/details/details-classroom.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClassRoom } from '../../../types/classroom.model';

@Component({
  selector: 'app-details-classroom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-classroom.component.html',
  styleUrls: ['./details-classroom.component.css']
})
export class DetailsClassroomComponent {
  @Input() classRoom!: ClassRoom; // Recebe o objeto via Input
}
