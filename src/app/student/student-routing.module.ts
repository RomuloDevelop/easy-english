import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseComponent } from './course/course.component'
import { CourseListComponent } from './course-list/course-list.component'
import { AddressComponent } from './address/address.component'

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: CourseListComponent
      },
      {
        path: 'edit-address',
        component: AddressComponent
      }
    ]
  },
  {
    path: 'view-course/:id',
    component: CourseComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
