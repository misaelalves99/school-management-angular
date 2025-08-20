// src/pages/students/details/details-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface Student {
  name: string;
  email: string;
  dateOfBirth: string;
  enrollmentNumber: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css'],
})
export class StudentDetailsComponent {
  id: string | null = null;
  student: Student = {
    name: 'João da Silva',
    email: 'joao@email.com',
    dateOfBirth: '2001-09-15',
    enrollmentNumber: '2025001',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123',
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    // TODO: fetch student by ID via service
  }

  edit() {
    this.router.navigate([`/students/edit/${this.id}`]);
  }

  back() {
    this.router.navigate(['/students']);
  }
}
