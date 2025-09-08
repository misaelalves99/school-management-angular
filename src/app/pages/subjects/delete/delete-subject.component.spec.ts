// src/pages/subjects/delete/delete-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { DeleteSubjectComponent } from './delete-subject.component';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { of } from 'rxjs';

describe('DeleteSubjectComponent', () => {
  let mockRouter: Partial<Router>;
  let mockSubjectService: Partial<SubjectService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockSubjectService = {
      getById: jasmine.createSpy('getById').and.returnValue(
        of({
          id: 1,
          name: 'Matemática',
          description: 'Disciplina de matemática',
          workloadHours: 60,
        })
      ),
      delete: jasmine.createSpy('delete'),
    };

    const mockParamMap: ParamMap = {
      get: (key: string) => (key === 'id' ? '1' : null),
      has: (key: string) => key === 'id',
      getAll: (key: string) => (key === 'id' ? ['1'] : []),
      keys: ['id'],
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: mockParamMap,
        queryParamMap: mockParamMap,
        url: [] as UrlSegment[],
        params: {},
        queryParams: {},
        fragment: null,
        data: {},
        outlet: 'primary',
        routeConfig: null,
        root: {} as any,
        parent: null,
        firstChild: null,
        children: [],
        pathFromRoot: [],
        toString: () => '',
        component: null,
        title: undefined, 
      },
    };
  });

  it('should create component and display title and warning', async () => {
    await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    expect(screen.getByText('Excluir Disciplina')).toBeTruthy();
    expect(screen.getByText('Tem certeza que deseja excluir esta disciplina?')).toBeTruthy();
    expect(screen.getByText('Matemática')).toBeTruthy();
  });

  it('should fetch subject on init', async () => {
    const { fixture } = await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const component = fixture.componentInstance;
    expect(mockSubjectService.getById).toHaveBeenCalledWith(1);
    expect(component.subject?.name).toBe('Matemática');
  });

  it('should navigate to /subjects on cancel', async () => {
    const { fixture } = await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const component = fixture.componentInstance;
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should call delete and navigate when handleDelete is confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    const { fixture } = await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const component = fixture.componentInstance;
    component.handleDelete();

    expect(window.confirm).toHaveBeenCalledWith(
      `Tem certeza que deseja excluir a disciplina: Matemática?`
    );
    expect(mockSubjectService.delete).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Disciplina excluída com sucesso.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should not delete if handleDelete is canceled', async () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(window, 'alert');

    const { fixture } = await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const component = fixture.componentInstance;
    component.handleDelete();

    expect(mockSubjectService.delete).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should trigger handleDelete when Excluir button is clicked', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const button = screen.getByText('Excluir');
    fireEvent.click(button);

    expect(mockSubjectService.delete).toHaveBeenCalledWith(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should trigger cancel when Cancelar button is clicked', async () => {
    await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const button = screen.getByText('Cancelar');
    fireEvent.click(button);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
