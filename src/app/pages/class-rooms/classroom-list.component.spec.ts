// src/pages/class-rooms/classroom-list.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ClassroomListComponent } from './classroom-list.component';
import { ClassRoomService } from '../../services/classroom.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ClassRoom } from '../../types/classroom.model';
import { screen, render, fireEvent } from '@testing-library/angular';
import { By } from '@angular/platform-browser';

describe('ClassroomListComponent', () => {
  let component: ClassroomListComponent;
  let fixture: ComponentFixture<ClassroomListComponent>;
  let classRoomServiceMock: jasmine.SpyObj<ClassRoomService>;

  const mockData: ClassRoom[] = [
    { id: 1, name: 'Sala A', capacity: 20, schedule: 'Seg 08:00-10:00', subjects: [], teachers: [], classTeacher: undefined },
    { id: 2, name: 'Sala B', capacity: 30, schedule: 'Ter 10:00-12:00', subjects: [], teachers: [], classTeacher: undefined },
    { id: 3, name: 'Sala C', capacity: 25, schedule: 'Qua 14:00-16:00', subjects: [], teachers: [], classTeacher: undefined },
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ClassRoomService', ['getAll']);
    serviceSpy.getAll.and.returnValue(of(mockData));

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, ClassroomListComponent],
      providers: [{ provide: ClassRoomService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassroomListComponent);
    component = fixture.componentInstance;
    classRoomServiceMock = TestBed.inject(ClassRoomService) as jasmine.SpyObj<ClassRoomService>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve chamar getAll e popular classrooms', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(classRoomServiceMock.getAll).toHaveBeenCalled();
    expect(component.classrooms.length).toBe(3);
  }));

  it('filteredData deve retornar salas filtradas por searchString', () => {
    component.searchString = 'B';
    const result = component.filteredData;
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Sala B');

    component.searchString = 'sala';
    expect(component.filteredData.length).toBe(3);
  });

  it('handleSearch deve prevenir comportamento padrão', () => {
    const event = new Event('submit');
    spyOn(event, 'preventDefault');
    component.handleSearch(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('deve renderizar mensagem "Nenhuma sala encontrada" quando filteredData estiver vazia', () => {
    component.classrooms = [];
    fixture.detectChanges();

    const noDataEl = fixture.nativeElement.querySelector('tbody tr td');
    expect(noDataEl.textContent).toContain('Nenhuma sala encontrada.');
  });

  it('deve atualizar searchString via input (two-way binding)', async () => {
    await render(ClassroomListComponent, {
      imports: [FormsModule, RouterTestingModule],
      componentProperties: { classrooms: mockData },
    });

    const input = screen.getByPlaceholderText('Digite o nome da sala...') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'Sala C' } });
    expect(input.value).toBe('Sala C');
  });

  //
  // ---- Novos testes cobrindo atualizações do template ----
  //
  it('deve renderizar todas as salas com coluna ID', () => {
    component.classrooms = mockData;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    const firstRowCells = rows[0].queryAll(By.css('td')).map(cell => cell.nativeElement.textContent.trim());
    expect(firstRowCells[0]).toBe('1'); // ID
    expect(firstRowCells[1]).toBe('Sala A'); // Nome
    expect(firstRowCells[2]).toBe('20'); // Capacidade
    expect(firstRowCells[3]).toBe('Seg 08:00-10:00'); // Horário
  });

  it('cada linha deve ter botões de ações com routerLinks corretos', () => {
    component.classrooms = mockData;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    const actionLinks = rows[1].queryAll(By.css('a')).map(a => a.nativeElement.getAttribute('ng-reflect-router-link'));

    expect(actionLinks).toContain('/classrooms/details,2');
    expect(actionLinks).toContain('/classrooms/edit,2');
    expect(actionLinks).toContain('/classrooms/delete,2');
  });

  it('deve ter link "Cadastrar Nova Sala" para /classrooms/create', () => {
    fixture.detectChanges();
    const createBtn = fixture.debugElement.query(By.css('.btnSuccess')).nativeElement as HTMLAnchorElement;
    expect(createBtn.getAttribute('ng-reflect-router-link')).toBe('/classrooms/create');
  });
});
