// src/pages/subjects/details/details-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { DetailsSubjectComponent } from './details-subject.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

describe('DetailsSubjectComponent', () => {

  it('should create the component and display title', async () => {
    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    expect(screen.getByText('Detalhes da Disciplina')).toBeTruthy();
    expect(screen.getByText('Matemática')).toBeTruthy();
    expect(screen.getByText('60 horas')).toBeTruthy();
  });

  it('should display "Disciplina não encontrada" if subjectId is invalid', async () => {
    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '999' } } } }
      ]
    });

    expect(screen.getByText('Disciplina não encontrada.')).toBeTruthy();
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };

    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '2' } } } }
      ]
    });

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects/edit/2']);
  });

  it('should navigate back when back button is clicked (from details)', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };

    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    const backButton = screen.getAllByText('Voltar')[0];
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate back when back button is clicked (from notFound template)', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };

    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '999' } } } }
      ]
    });

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
