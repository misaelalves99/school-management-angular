// src/pages/subjects/details/details-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { DetailsSubjectComponent } from './details-subject.component';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { of } from 'rxjs';


describe('DetailsSubjectComponent', () => {
  let mockRouter: Partial<Router>;
  let mockSubjectService: Partial<SubjectService>;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    // Mock do SubjectService com lista completa para getAll()
    mockSubjectService = {
      getAll: jasmine.createSpy('getAll').and.returnValue(
        of([
          { id: 1, name: 'Matemática', description: 'Disciplina de matemática', workloadHours: 60 },
          { id: 2, name: 'Física', description: 'Disciplina de física', workloadHours: 80 }
        ])
      )
    };
  });

  const createActivatedRouteMock = (id: string | null): Partial<ActivatedRoute> => {
    const mockParamMap: ParamMap = {
      get: (_key: string) => id,
      getAll: (_key: string) => (id ? [id] : []),
      has: (_key: string) => id !== null,
      keys: id ? ['id'] : []
    };

    return {
      snapshot: {
        paramMap: mockParamMap
      } as any,
    };
  };

  it('should display subject details when found', async () => {
    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('1') }
      ]
    });

    expect(screen.getByText('Detalhes da Disciplina')).toBeTruthy();
    expect(screen.getByText('Matemática')).toBeTruthy();
    expect(screen.getByText('Disciplina de matemática')).toBeTruthy();
    expect(screen.getByText('60 horas')).toBeTruthy();
  });

  it('should show "Disciplina não encontrada" if subjectId not in list', async () => {
    spyOn(window, 'alert');

    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('999') }
      ]
    });

    expect(screen.getByText('Disciplina não encontrada')).toBeTruthy();
    expect(window.alert).toHaveBeenCalledWith('Disciplina não encontrada');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should alert and navigate if id is null', async () => {
    spyOn(window, 'alert');

    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock(null) }
      ]
    });

    expect(window.alert).toHaveBeenCalledWith('ID inválido');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('2') }
      ]
    });

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects/edit/2']);
  });

  it('should navigate back when back button is clicked (details template)', async () => {
    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('1') }
      ]
    });

    const backButton = screen.getAllByText('Voltar')[0];
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should navigate back when back button is clicked (notFound template)', async () => {
    await render(DetailsSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock('999') }
      ]
    });

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
