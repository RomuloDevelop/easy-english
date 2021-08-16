import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminComponent } from './admin.component'
import { CoursesComponent } from './course/courses/courses.component'
import { CreateCourseComponent } from './course/create-course/create-course.component'
import { CreateSectionComponent } from './course/create-course/create-section/create-section.component'
import { HomePageComponent } from './course/create-course/home-page/home-page.component'
import { CreateUserComponent } from './user/create-user/create-user.component'
import { UsersComponent } from './user/users/users.component'
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
      },
      {
        path: 'users/:role',
        children: [
          {
            path: '',
            component: UsersComponent
          },
          {
            path: 'create',
            component: CreateUserComponent
          },
          {
            path: 'edit/:id',
            component: CreateUserComponent
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
