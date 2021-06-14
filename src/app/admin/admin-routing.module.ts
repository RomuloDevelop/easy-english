import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminComponent } from './admin.component'
import { CoursesComponent } from './courses/courses.component'
import { CreateCourseComponent } from './create-course/create-course.component'
import { CreateSectionComponent } from './create-course/create-section/create-section.component'
import { HomePageComponent } from './create-course/home-page/home-page.component'
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
        path: 'create-course/:id',
        component: CreateCourseComponent,
        children: [
          {
            path: 'home-page',
            component: HomePageComponent
          },
          {
            path: 'create-section',
            component: CreateSectionComponent
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
