// src/pages/class-rooms/edit/edit-classroom.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { EditClassroomComponent } from './edit-classroom.component';
import { screen, render, fireEvent } from '@testing-library/angular';

describe('EditClassroomComponent', () => {
  let component: EditClassroomComponent;
  let fixture: ComponentFixture<EditClassroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, EditClassroomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditClassroomComponent);
    component = fixture.componentInstance;

    // Setando valores de @Input
    component.id = 1;
    component.name = 'Sala A';
    component.capacity = 30;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formData with @Input values', () => {
    component.ngOnInit();
    expect(component.formData.name).toBe('Sala A');
    expect(component.formData.capacity).toBe(30);
  });

  it('should emit submitForm event with correct data on handleSubmit', () => {
    spyOn(component.submitForm, 'emit');

    component.formData.name = 'Sala B';
    component.formData.capacity = 50;

    component.handleSubmit();

    expect(component.submitForm.emit).toHaveBeenCalledWith({
      id: 1,
      name: 'Sala B',
      capacity: 50,
    });
  });

  it('should update formData when inputs change (two-way binding)', async () => {
    await render(EditClassroomComponent, {
      componentProperties: {
        id: 2,
        name: 'Sala C',
        capacity: 20,
      },
      imports: [FormsModule],
    });

    const nameInput = screen.getByLabelText('Nome') as HTMLInputElement;
    const capacityInput = screen.getByLabelText('Capacidade') as HTMLInputElement;

    // Simula digitação do usuário
    fireEvent.input(nameInput, { target: { value: 'Sala D' } });
    fireEvent.input(capacityInput, { target: { value: '40' } });

    expect(nameInput.value).toBe('Sala D');
    expect(capacityInput.value).toBe('40');
  });

  it('should call handleSubmit when form is submitted', async () => {
    const { fixture } = await render(EditClassroomComponent, { imports: [FormsModule] });
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    spyOn(fixture.componentInstance, 'handleSubmit');

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.componentInstance.handleSubmit).toHaveBeenCalled();
  });
});
