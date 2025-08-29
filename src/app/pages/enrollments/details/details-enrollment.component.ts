// src/pages/enrollments/details/details-enrollment.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './details-enrollment.component.html',
  styleUrls: ['./details-enrollment.component.css'],
})
export class DetailsEnrollmentComponent {
  @Input() enrollment: EnrollmentDetails = {
    id: 0,
    studentName: null,
    classRoomName: null,
    status: null,
    enrollmentDate: new Date().toISOString(),
  };

  constructor(private router: Router) {}

  edit() {
    this.router.navigate([`/enrollments/edit/${this.enrollment.id}`]);
  }

  back() {
    this.router.navigate(['/enrollments']);
  }
}
