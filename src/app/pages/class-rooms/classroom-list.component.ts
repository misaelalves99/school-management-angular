// src/pages/class-rooms/classroom-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClassRoom } from '../../types/classroom.model';
import { ClassRoomService } from '../../services/classroom.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './classroom-list.component.html',
  styleUrls: ['./classroom-list.component.css'],
})
export class ClassroomListComponent implements OnInit {
  searchString = '';
  page = 1;
  pageSize = 2;

  classrooms: ClassRoom[] = []; // array interno para manipulação
  classrooms$: Observable<ClassRoom[]> = new Observable<ClassRoom[]>(); // observable do service

  constructor(private classRoomService: ClassRoomService) {}

  ngOnInit() {
    // inscreve e atualiza o array local
    this.classRoomService.getAll().subscribe((data) => {
      this.classrooms = data;
    });
  }

  get filteredData(): ClassRoom[] {
    return this.classrooms.filter((c) =>
      c.name.toLowerCase().includes(this.searchString.toLowerCase())
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize) || 1;
  }

  get pagedData(): ClassRoom[] {
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    return this.filteredData.slice(start, end);
  }

  handleSearch(event: Event) {
    event.preventDefault();
    this.page = 1;
  }

  previousPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }
}
