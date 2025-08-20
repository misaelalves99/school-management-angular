// src/pages/class-rooms/edit/edit-classroom.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-classroom',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-classroom.component.html',
  styleUrls: ['./edit-classroom.component.css'],
})
export class EditClassroomComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() capacity!: number;

  @Output() submitForm = new EventEmitter<{ id: number; name: string; capacity: number }>();

  formData = { name: '', capacity: 1 };

  ngOnInit() {
    this.formData = { name: this.name, capacity: this.capacity };
  }

  handleSubmit() {
    this.submitForm.emit({ id: this.id, ...this.formData });
  }
}
