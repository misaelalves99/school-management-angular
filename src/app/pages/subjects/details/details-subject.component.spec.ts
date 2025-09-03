// src/pages/subjects/details/details-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { DetailsSubjectComponent } from './details-subject.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { of } from 'rxjs';

describe('DetailsSubjectComponent', () => {
  let mockRouter: Partial<Router>;
  let mockSubjectService: Partial<SubjectService>;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockSubjectService = {
      getById: jasmine.createSpy('getById').and.callFake((id: number) => {
        if (id === 999) return of(null); // simula não encontrado
        return of({
          id,
          name: 'Matemática',
          description: 'Disciplina de matemática',
          workloadHours: 60
        });
      })
    };
  });

  it('should display subject details when found', async () => {
    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    expect(screen.getByText('Detalhes da Disciplina')).toBeTruthy();
    expect(screen.getByText('Matemática')).toBeTruthy();
    expect(screen.getByText('Disciplina de matemática')).toBeTruthy();
    expect(screen.getByText('60 horas')).toBeTruthy();
  });

  it('should display "Disciplina não encontrada" if subjectId is invalid', async () => {
    spyOn(window, 'alert');

    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '999' } } } }
      ]
    });

    expect(screen.getByText('Disciplina não encontrada')).toBeTruthy();
    expect(window.alert).toHaveBeenCalledWith('Disciplina não encontrada');
  });

  it('should alert and navigate if id is not valid', async () => {
    spyOn(window, 'alert');

    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    });

    expect(window.alert).toHaveBeenCalledWith('ID inválido');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const { fixture } = await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '2' } } } }
      ]
    });

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects/edit/2']);
  });

  it('should navigate back when back button is clicked (details template)', async () => {
    const { fixture } = await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });

    const backButton = screen.getAllByText('Voltar')[0];
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate back when back button is clicked (notFound template)', async () => {
    const { fixture } = await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '999' } } } }
      ]
    });

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
