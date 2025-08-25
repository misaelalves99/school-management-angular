// src/pages/subjects/subjects-index.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { SubjectsIndexComponent } from './subjects-index.component';
import { SubjectService } from '../../services/subject.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

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
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    // Verifica se a tabela exibe os dois primeiros itens da página 1 (PAGE_SIZE=2)
    expect(screen.getByText('Matemática')).toBeTruthy();
    expect(screen.getByText('Física')).toBeTruthy();
    expect(screen.queryByText('Química')).toBeNull();
  });

  it('should filter subjects by search', async () => {
    await render(SubjectsIndexComponent, {
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const input = screen.getByPlaceholderText('Digite o nome ou descrição...') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'química' } });

    expect(screen.getByText('Química')).toBeTruthy();
    expect(screen.queryByText('Matemática')).toBeNull();
    expect(screen.queryByText('Física')).toBeNull();
  });

  it('should go to next and previous pages', async () => {
    await render(SubjectsIndexComponent, {
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const nextBtn = screen.getByText('Próxima');
    fireEvent.click(nextBtn);

    // Após avançar para a página 2, deve mostrar o terceiro item
    expect(screen.getByText('Química')).toBeTruthy();
    expect(screen.queryByText('Matemática')).toBeNull();

    const prevBtn = screen.getByText('Anterior');
    fireEvent.click(prevBtn);

    // Página 1 novamente
    expect(screen.getByText('Matemática')).toBeTruthy();
    expect(screen.getByText('Física')).toBeTruthy();
    expect(screen.queryByText('Química')).toBeNull();
  });

  it('should reset page to 1 when search changes', async () => {
    await render(SubjectsIndexComponent, {
      providers: [
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const componentRef = screen.getByPlaceholderText('Digite o nome ou descrição...');
    fireEvent.input(componentRef, { target: { value: 'Física' } });

    // Página deve ser resetada para 1
    expect(screen.getByText('Página 1 de 1')).toBeTruthy();
  });
});
