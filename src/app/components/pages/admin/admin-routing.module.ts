import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component'
import {CoursesComponent} from './courses/courses.component'
import {CreateSectionComponent} from './create-course/create-section.component'
const routes: Routes = [
    {
      path: '',
      component: AdminComponent,
      children: [
        {
          path: '',
          component: CoursesComponent
        },
        {
          path: 'create-course',
          component: CreateSectionComponent
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
