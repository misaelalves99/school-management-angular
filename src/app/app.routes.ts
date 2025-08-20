// src/app/app.routes.ts

import { Routes } from '@angular/router';

// Home
import { HomePageComponent } from './pages/home/home-page.component';

// Students
import { StudentsPageComponent } from './pages/students/students-page.component';
import { CreateStudentComponent } from './pages/students/create/create-page.component';
import { EditStudentComponent } from './pages/students/edit/edit-page.component';
import { StudentDetailsComponent } from './pages/students/details/details-page.component';
import { DeleteStudentComponent } from './pages/students/delete/delete-page.component';

// Teachers
import { TeachersPageComponent } from './pages/teachers/teachers-page.component';
import { CreateTeacherComponent } from './pages/teachers/create/create-teacher.component';
import { EditTeacherComponent } from './pages/teachers/edit/edit-teacher.component';
import { DetailsTeacherComponent } from './pages/teachers/details/details-teacher.component';
import { DeleteTeacherComponent } from './pages/teachers/delete/delete-teacher.component';

// Subjects
import { SubjectsIndexComponent } from './pages/subjects/subjects-index.component';
import { DetailsSubjectComponent } from './pages/subjects/details/details-subject.component';
import { EditSubjectComponent } from './pages/subjects/edit/edit-subject.component';
import { DeleteSubjectComponent } from './pages/subjects/delete/delete-subject.component';

// ClassRooms
import { ClassroomListComponent } from './pages/class-rooms/classroom-list.component';
import { CreateClassroomComponent } from './pages/class-rooms/create/create-classroom.component';
import { DetailsClassroomComponent } from './pages/class-rooms/details/details-classroom.component';
import { EditClassroomComponent } from './pages/class-rooms/edit/edit-classroom.component';
import { DeleteClassroomComponent } from './pages/class-rooms/delete/delete-classroom.component';

// Enrollments
import { EnrollmentIndexComponent } from './pages/enrollments/enrollment-index.component';
import { CreateEnrollmentComponent } from './pages/enrollments/create/create-enrollment.component';
import { DetailsEnrollmentComponent } from './pages/enrollments/details/details-enrollment.component';
import { EditEnrollmentComponent } from './pages/enrollments/edit/edit-enrollment.component';
import { DeleteEnrollmentComponent } from './pages/enrollments/delete/delete-enrollment.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },

  // Students
  { path: 'students', component: StudentsPageComponent },
  { path: 'students/create', component: CreateStudentComponent },
  { path: 'students/details/:id', component: StudentDetailsComponent },
  { path: 'students/edit/:id', component: EditStudentComponent },
  { path: 'students/delete/:id', component: DeleteStudentComponent },

  // Teachers
  { path: 'teachers', component: TeachersPageComponent },
  { path: 'teachers/create', component: CreateTeacherComponent },
  { path: 'teachers/details/:id', component: DetailsTeacherComponent },
  { path: 'teachers/edit/:id', component: EditTeacherComponent },
  { path: 'teachers/delete/:id', component: DeleteTeacherComponent },

  // Subjects
  { path: 'subjects', component: SubjectsIndexComponent },
  { path: 'subjects/details/:id', component: DetailsSubjectComponent },
  { path: 'subjects/edit/:id', component: EditSubjectComponent },
  { path: 'subjects/delete/:id', component: DeleteSubjectComponent },

  // ClassRooms
  { path: 'classrooms', component: ClassroomListComponent },
  { path: 'classrooms/create', component: CreateClassroomComponent },
  { path: 'classrooms/details/:id', component: DetailsClassroomComponent },
  { path: 'classrooms/edit/:id', component: EditClassroomComponent },
  { path: 'classrooms/delete/:id', component: DeleteClassroomComponent },

  // Enrollments
  { path: 'enrollments', component: EnrollmentIndexComponent },
  { path: 'enrollments/create', component: CreateEnrollmentComponent },
  { path: 'enrollments/details/:id', component: DetailsEnrollmentComponent },
  { path: 'enrollments/edit/:id', component: EditEnrollmentComponent },
  { path: 'enrollments/delete/:id', component: DeleteEnrollmentComponent },

  // Redirect unknown routes
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
