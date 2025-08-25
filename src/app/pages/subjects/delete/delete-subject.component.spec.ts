// src/pages/subjects/delete/delete-subject.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { DeleteSubjectComponent } from './delete-subject.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

describe('DeleteSubjectComponent', () => {
  it('should create the component and display title', async () => {
    await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } }
        }
      ]
    });

    expect(screen.getByText('Excluir Disciplina')).toBeTruthy();
    expect(screen.getByText('Tem certeza que deseja excluir esta disciplina?')).toBeTruthy();
  });

  it('should get subjectId from route params', async () => {
    const { fixture } = await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '456' } } }
        }
      ]
    });

    const component = fixture.componentInstance;
    expect(component.subjectId).toBe('456');
  });

  it('should call router.navigate on handleDelete', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };

    const { fixture } = await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '789' } } }
        }
      ]
    });

    const component = fixture.componentInstance;
    component.handleDelete();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should call router.navigate on cancel', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };

    const { fixture } = await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '101' } } }
        }
      ]
    });

    const component = fixture.componentInstance;
    component.cancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should trigger handleDelete when Excluir button is clicked', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };

    await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '202' } } }
        }
      ]
    });

    const deleteButton = screen.getByText('Excluir');
    fireEvent.click(deleteButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });

  it('should trigger cancel when Cancelar button is clicked', async () => {
    const mockRouter = { navigate: jasmine.createSpy('navigate') };

    await render(DeleteSubjectComponent, {
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '303' } } }
        }
      ]
    });

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/subjects']);
  });
});
