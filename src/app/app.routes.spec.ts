// src/app/app.routes.spec.ts

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app.routes';

// Components
import { HomePageComponent } from './pages/home/home-page.component';
import { StudentsPageComponent } from './pages/students/students-page.component';
import { CreateStudentComponent } from './pages/students/create/create-page.component';
import { EditStudentComponent } from './pages/students/edit/edit-page.component';
import { StudentDetailsComponent } from './pages/students/details/details-page.component';
import { DeleteStudentComponent } from './pages/students/delete/delete-page.component';

import { TeachersPageComponent } from './pages/teachers/teachers-page.component';
import { CreateTeacherComponent } from './pages/teachers/create/create-teacher.component';
import { EditTeacherComponent } from './pages/teachers/edit/edit-teacher.component';
import { DetailsTeacherComponent } from './pages/teachers/details/details-teacher.component';
import { DeleteTeacherComponent } from './pages/teachers/delete/delete-teacher.component';

import { SubjectsIndexComponent } from './pages/subjects/subjects-index.component';
import { DetailsSubjectComponent } from './pages/subjects/details/details-subject.component';
import { EditSubjectComponent } from './pages/subjects/edit/edit-subject.component';
import { DeleteSubjectComponent } from './pages/subjects/delete/delete-subject.component';

import { ClassroomListComponent } from './pages/class-rooms/classroom-list.component';
import { CreateClassroomComponent } from './pages/class-rooms/create/create-classroom.component';
import { DetailsClassroomComponent } from './pages/class-rooms/details/details-classroom.component';
import { EditClassroomComponent } from './pages/class-rooms/edit/edit-classroom.component';
import { DeleteClassroomComponent } from './pages/class-rooms/delete/delete-classroom.component';

import { EnrollmentIndexComponent } from './pages/enrollments/enrollment-index.component';
import { CreateEnrollmentComponent } from './pages/enrollments/create/create-enrollment.component';
import { DetailsEnrollmentComponent } from './pages/enrollments/details/details-enrollment.component';
import { EditEnrollmentComponent } from './pages/enrollments/edit/edit-enrollment.component';
import { DeleteEnrollmentComponent } from './pages/enrollments/delete/delete-enrollment.component';

describe('App Routes', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should have home route', () => {
    const homeRoute = routes.find(r => r.path === '');
    expect(homeRoute?.component).toBe(HomePageComponent);
  });

  it('should have correct student routes', () => {
    const studentRoutes = [
      { path: 'students', component: StudentsPageComponent },
      { path: 'students/create', component: CreateStudentComponent },
      { path: 'students/details/:id', component: StudentDetailsComponent },
      { path: 'students/edit/:id', component: EditStudentComponent },
      { path: 'students/delete/:id', component: DeleteStudentComponent },
    ];

    studentRoutes.forEach(r => {
      const route = routes.find(route => route.path === r.path);
      expect(route?.component).toBe(r.component);
    });
  });

  it('should have correct teacher routes', () => {
    const teacherRoutes = [
      { path: 'teachers', component: TeachersPageComponent },
      { path: 'teachers/create', component: CreateTeacherComponent },
      { path: 'teachers/details/:id', component: DetailsTeacherComponent },
      { path: 'teachers/edit/:id', component: EditTeacherComponent },
      { path: 'teachers/delete/:id', component: DeleteTeacherComponent },
    ];

    teacherRoutes.forEach(r => {
      const route = routes.find(route => route.path === r.path);
      expect(route?.component).toBe(r.component);
    });
  });

  it('should have correct subject routes', () => {
    const subjectRoutes = [
      { path: 'subjects', component: SubjectsIndexComponent },
      { path: 'subjects/details/:id', component: DetailsSubjectComponent },
      { path: 'subjects/edit/:id', component: EditSubjectComponent },
      { path: 'subjects/delete/:id', component: DeleteSubjectComponent },
    ];

    subjectRoutes.forEach(r => {
      const route = routes.find(route => route.path === r.path);
      expect(route?.component).toBe(r.component);
    });
  });

  it('should have correct classroom routes', () => {
    const classroomRoutes = [
      { path: 'classrooms', component: ClassroomListComponent },
      { path: 'classrooms/create', component: CreateClassroomComponent },
      { path: 'classrooms/details/:id', component: DetailsClassroomComponent },
      { path: 'classrooms/edit/:id', component: EditClassroomComponent },
      { path: 'classrooms/delete/:id', component: DeleteClassroomComponent },
    ];

    classroomRoutes.forEach(r => {
      const route = routes.find(route => route.path === r.path);
      expect(route?.component).toBe(r.component);
    });
  });

  it('should have correct enrollment routes', () => {
    const enrollmentRoutes = [
      { path: 'enrollments', component: EnrollmentIndexComponent },
      { path: 'enrollments/create', component: CreateEnrollmentComponent },
      { path: 'enrollments/details/:id', component: DetailsEnrollmentComponent },
      { path: 'enrollments/edit/:id', component: EditEnrollmentComponent },
      { path: 'enrollments/delete/:id', component: DeleteEnrollmentComponent },
    ];

    enrollmentRoutes.forEach(r => {
      const route = routes.find(route => route.path === r.path);
      expect(route?.component).toBe(r.component);
    });
  });

  it('should redirect unknown paths to home', () => {
    const wildcard = routes.find(r => r.path === '**');
    expect(wildcard).toBeTruthy();
    expect(wildcard?.redirectTo).toBe('');
    expect(wildcard?.pathMatch).toBe('full');
  });
});
