// src/pages/subjects/subjects-index.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { SubjectsIndexComponent } from './subjects-index.component';
import { SubjectService } from '../../services/subject.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('SubjectsIndexComponent', () => {
  const mockSubjects = [
    { id: 1, name: 'Matemática', description: 'Matemática básica', workloadHours: 60 },
    { id: 2, name: 'Física', description: 'Física moderna', workloadHours: 60 },
    { id: 3, name: 'Química', description: 'Química orgânica', workloadHours: 60 },
  ];

  const subjectServiceMock = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of(mockSubjects)),
  };

  const routerMock = { navigate: jasmine.createSpy('navigate') };

  it('should create and display initial subjects', async () => {
    await render(SubjectsIndexComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    expect(screen.getByText('Matemática')).toBeTruthy();
    expect(screen.getByText('Física')).toBeTruthy();
    expect(screen.getByText('Química')).toBeTruthy();
  });

  it('should filter subjects by name', async () => {
    await render(SubjectsIndexComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const input = screen.getByPlaceholderText('Digite o nome ou descrição...') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'física' } });

    expect(screen.getByText('Física')).toBeTruthy();
    expect(screen.queryByText('Matemática')).toBeNull();
    expect(screen.queryByText('Química')).toBeNull();
  });

  it('should filter subjects by description', async () => {
    await render(SubjectsIndexComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const input = screen.getByPlaceholderText('Digite o nome ou descrição...') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'orgânica' } });

    expect(screen.getByText('Química')).toBeTruthy();
    expect(screen.queryByText('Matemática')).toBeNull();
    expect(screen.queryByText('Física')).toBeNull();
  });

  it('should show "Nenhuma disciplina encontrada" if search yields no results', async () => {
    await render(SubjectsIndexComponent, {
      imports: [FormsModule],
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const input = screen.getByPlaceholderText('Digite o nome ou descrição...') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'biologia' } });

    expect(screen.getByText('Nenhuma disciplina encontrada.')).toBeTruthy();
  });
});
