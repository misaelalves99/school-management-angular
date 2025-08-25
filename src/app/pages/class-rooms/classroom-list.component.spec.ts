// src/pages/class-rooms/classroom-list.component.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ClassroomListComponent } from './classroom-list.component';
import { ClassRoomService } from '../../services/classroom.service';
import { screen, render, fireEvent } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ClassRoom } from '../../types/classroom.model';

describe('ClassroomListComponent', () => {
  let component: ClassroomListComponent;
  let fixture: ComponentFixture<ClassroomListComponent>;
  let classRoomServiceMock: Partial<ClassRoomService>;

  const mockData: ClassRoom[] = [
    {
      id: 1,
      name: 'Sala A',
      capacity: 20,
      schedule: 'Seg 08:00-10:00',
      subjects: [{ id: 1, name: 'Matemática', description: 'Matéria de Matemática', workloadHours: 60 }],
      teachers: [
        { id: 1, name: 'Prof. Ana', email: 'ana@email.com', dateOfBirth: '1980-01-01', subject: 'Matemática', phone: '123456789', address: 'Rua A, 123' }
      ],
      classTeacher: { id: 1, name: 'Prof. Ana', email: 'ana@email.com', dateOfBirth: '1980-01-01', subject: 'Matemática', phone: '123456789', address: 'Rua A, 123' }
    },
    {
      id: 2,
      name: 'Sala B',
      capacity: 30,
      schedule: 'Ter 10:00-12:00',
      subjects: [{ id: 2, name: 'Física', description: 'Matéria de Física', workloadHours: 50 }],
      teachers: [
        { id: 2, name: 'Prof. João', email: 'joao@email.com', dateOfBirth: '1982-02-02', subject: 'Física', phone: '987654321', address: 'Rua B, 456' }
      ],
      classTeacher: { id: 2, name: 'Prof. João', email: 'joao@email.com', dateOfBirth: '1982-02-02', subject: 'Física', phone: '987654321', address: 'Rua B, 456' }
    },
    {
      id: 3,
      name: 'Sala C',
      capacity: 25,
      schedule: 'Qua 14:00-16:00',
      subjects: [{ id: 3, name: 'Química', description: 'Matéria de Química', workloadHours: 55 }],
      teachers: [
        { id: 3, name: 'Prof. Carlos', email: 'carlos@email.com', dateOfBirth: '1978-03-03', subject: 'Química', phone: '1122334455', address: 'Rua C, 789' }
      ],
      classTeacher: { id: 3, name: 'Prof. Carlos', email: 'carlos@email.com', dateOfBirth: '1978-03-03', subject: 'Química', phone: '1122334455', address: 'Rua C, 789' }
    },
  ];

  beforeEach(async () => {
    classRoomServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(mockData)),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, ClassroomListComponent],
      providers: [{ provide: ClassRoomService, useValue: classRoomServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassroomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call service and populate classrooms on ngOnInit', () => {
    component.ngOnInit();
    expect(classRoomServiceMock.getAll).toHaveBeenCalled();
    expect(component.classrooms.length).toBe(3);
    expect(component.classrooms[0].name).toBe('Sala A');
  });

  it('should filter classrooms based on searchString', () => {
    component.searchString = 'B';
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('Sala B');
  });

  it('should calculate totalPages correctly', () => {
    component.pageSize = 2;
    expect(component.totalPages).toBe(2);
  });

  it('should paginate data correctly', () => {
    component.pageSize = 2;
    component.page = 1;
    let page1 = component.pagedData;
    expect(page1.length).toBe(2);
    expect(page1[0].name).toBe('Sala A');
    expect(page1[1].name).toBe('Sala B');

    component.page = 2;
    let page2 = component.pagedData;
    expect(page2.length).toBe(1);
    expect(page2[0].name).toBe('Sala C');
  });

  it('should reset page to 1 on search', () => {
    component.page = 2;
    component.handleSearch(new Event('submit'));
    expect(component.page).toBe(1);
  });

  it('should go to previous and next pages correctly', () => {
    component.pageSize = 2;
    component.page = 2;
    component.previousPage();
    expect(component.page).toBe(1);

    component.nextPage();
    expect(component.page).toBe(2);

    component.nextPage();
    expect(component.page).toBe(2);
  });

  it('should update search input value via two-way binding', async () => {
    await render(ClassroomListComponent, {
      imports: [FormsModule, RouterTestingModule],
      componentProperties: { classrooms: mockData },
    });

    const input = screen.getByPlaceholderText('Digite o nome da sala...') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'Sala C' } });

    expect(input.value).toBe('Sala C');
  });
});
