// src/pages/students/students-page.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { StudentsPageComponent } from './students-page.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

describe('StudentsPageComponent', () => {
  it('should create the component and render initial students', async () => {
    await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });

    expect(screen.getByText('João Silva')).toBeTruthy();
    expect(screen.getByText('Maria Oliveira')).toBeTruthy();
    expect(screen.getByText('Carlos Santos')).toBeTruthy();
  });

  it('should filter students by search', async () => {
    const componentRef = await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });
    const input = screen.getByPlaceholderText('Digite o nome...');
    fireEvent.input(input, { target: { value: 'Maria' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(screen.queryByText('João Silva')).toBeNull();
    expect(screen.getByText('Maria Oliveira')).toBeTruthy();
  });

  it('should paginate students', async () => {
    const longMockStudents = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Aluno ${i + 1}`,
      enrollmentNumber: `202300${i + 1}`,
      phone: '123',
      address: 'Rua Teste',
    }));

    const { fixture } = await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });
    const componentInstance = fixture.componentInstance;

    // Mock do método updateStudents para preencher students
    spyOn(componentInstance, 'updateStudents').and.callFake(() => {
      const filtered = longMockStudents.filter(s =>
        s.name.toLowerCase().includes(componentInstance.search.toLowerCase())
      );
      const start = (componentInstance.page - 1) * componentInstance.pageSize;
      componentInstance.students = filtered.slice(start, start + componentInstance.pageSize);
      componentInstance.totalPages = Math.ceil(filtered.length / componentInstance.pageSize);
    });

    componentInstance.pageSize = 10;
    componentInstance.page = 1;
    componentInstance.updateStudents();

    // Página inicial
    expect(componentInstance.students.length).toBe(10);

    componentInstance.nextPage();
    componentInstance.updateStudents();
    expect(componentInstance.page).toBe(2);
    expect(componentInstance.students.length).toBe(5);

    componentInstance.prevPage();
    componentInstance.updateStudents();
    expect(componentInstance.page).toBe(1);
    expect(componentInstance.students.length).toBe(10);
  });

  it('should not go to previous page if already on first page', async () => {
    const { fixture } = await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });
    const componentInstance = fixture.componentInstance;

    componentInstance.page = 1;
    componentInstance.prevPage();
    expect(componentInstance.page).toBe(1);
  });

  it('should not go to next page if already on last page', async () => {
    const { fixture } = await render(StudentsPageComponent, { imports: [FormsModule, RouterModule] });
    const componentInstance = fixture.componentInstance;

    componentInstance.page = componentInstance.totalPages;
    componentInstance.nextPage();
    expect(componentInstance.page).toBe(componentInstance.totalPages);
  });
});
