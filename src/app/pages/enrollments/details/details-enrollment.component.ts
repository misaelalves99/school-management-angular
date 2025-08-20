// src/pages/enrollments/details/details-enrollment.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface EnrollmentDetails {
  id: number;
  studentName: string | null;
  classRoomName: string | null;
  status: string | null;
  enrollmentDate: string; // ISO string
}

@Component({
  selector: 'app-details-enrollment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-enrollment.component.html',
  styleUrls: ['./details-enrollment.component.css'],
})
export class DetailsEnrollmentComponent {
  @Input() enrollment!: EnrollmentDetails;

  constructor(private router: Router) {}

  edit() {
    this.router.navigate([`/enrollments/edit/${this.enrollment.id}`]);
  }

  back() {
    this.router.navigate(['/enrollments']);
  }
}
