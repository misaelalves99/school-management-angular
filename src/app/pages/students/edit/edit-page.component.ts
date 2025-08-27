// src/pages/students/edit/edit-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService, StudentFormData } from '../../../services/student.service';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css'],
})
export class EditStudentComponent implements OnInit {
  id: number | null = null;

  formData: StudentFormData = {
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  };

  errors: Partial<Record<keyof StudentFormData, string>> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = Number(idParam);

    if (!idParam || isNaN(parsedId)) {
      alert('ID inválido.');
      this.router.navigate(['/students']);
      return;
    }

    this.id = parsedId;

    this.studentService.getById(this.id).subscribe((student) => {
      if (!student) {
        alert('Aluno não encontrado.');
        this.router.navigate(['/students']);
        return;
      }
      // Remove o id para editar apenas os campos do formulário
      const { id: _ignored, ...rest } = student;
      this.formData = { ...rest };
    });
  }

  private validate(): boolean {
    const errs: Partial<Record<keyof StudentFormData, string>> = {};
    if (!this.formData.name?.trim()) errs.name = 'Nome é obrigatório.';
    if (!this.formData.email?.trim()) errs.email = 'Email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(this.formData.email)) errs.email = 'Email inválido.';
    if (!this.formData.dateOfBirth) errs.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!this.formData.enrollmentNumber?.trim()) errs.enrollmentNumber = 'Matrícula é obrigatória.';

    this.errors = errs;
    return Object.keys(errs).length === 0;
  }

  handleSubmit(): void {
    if (this.id == null) return;
    if (!this.validate()) return;

    this.studentService.update(this.id, this.formData).subscribe((updated) => {
      if (!updated) {
        alert('Falha ao atualizar: aluno não encontrado.');
        return;
      }
      alert('Aluno atualizado com sucesso!');
      this.router.navigate(['/students']);
    });
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}
