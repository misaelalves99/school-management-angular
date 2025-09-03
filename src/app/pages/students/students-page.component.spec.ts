// src/pages/students/students-page.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { StudentsPageComponent, mockStudents } from './students-page.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

describe('StudentsPageComponent', () => {
  it('should create the component and render initial students', async () => {
    await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });

    mockStudents.forEach(s => {
      expect(screen.getByText(s.name)).toBeTruthy();
      expect(screen.getByText(s.enrollmentNumber)).toBeTruthy();
    });
  });

  it('should filter students by search term', async () => {
    await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });

    const input = screen.getByPlaceholderText('Digite o nome...');
    fireEvent.input(input, { target: { value: 'Maria' } });

    // Submeter o formulário de busca
    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(screen.queryByText('João Silva')).toBeNull();
    expect(screen.getByText('Maria Oliveira')).toBeTruthy();
    expect(screen.queryByText('Carlos Santos')).toBeNull();
  });

  it('should show "Nenhum aluno encontrado" if search yields no results', async () => {
    await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });

    const input = screen.getByPlaceholderText('Digite o nome...');
    fireEvent.input(input, { target: { value: 'XYZ' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(screen.getByText('Nenhum aluno encontrado.')).toBeTruthy();
  });

  it('should render action buttons with correct links', async () => {
    await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });

    const student = mockStudents[0];
    const detalhesLink = screen.getByText('Detalhes').closest('a')!;
    const editarLink = screen.getByText('Editar').closest('a')!;
    const excluirLink = screen.getByText('Excluir').closest('a')!;

    expect(detalhesLink.getAttribute('href')).toContain(`/students/details/${student.id}`);
    expect(editarLink.getAttribute('href')).toContain(`/students/edit/${student.id}`);
    expect(excluirLink.getAttribute('href')).toContain(`/students/delete/${student.id}`);
  });

  it('should render "Cadastrar Novo Aluno" button', async () => {
    await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });

    const createButton = screen.getByText('Cadastrar Novo Aluno').closest('a')!;
    expect(createButton).toBeTruthy();
    expect(createButton.getAttribute('href')).toBe('/students/create');
  });
});
