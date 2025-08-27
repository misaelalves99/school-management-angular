// src/pages/class-rooms/classroom-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClassRoom } from '../../types/classroom.model';
import { ClassRoomService } from '../../services/classroom.service';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './classroom-list.component.html',
  styleUrls: ['./classroom-list.component.css'],
})
export class ClassroomListComponent implements OnInit {
  searchString = '';

  classrooms: ClassRoom[] = []; // array interno para manipulação

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

  handleSearch(event: Event) {
    event.preventDefault();
  }
}
