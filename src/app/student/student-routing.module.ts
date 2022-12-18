import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ViewCourseComponent } from './course/view-course/view-course.component'
import { DetailComponent } from './course/detail/detail.component'

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { animation: 'Courses' }
  },
  {
    path: 'course-detail/:id',
    component: DetailComponent
  },
  {
    path: 'view-course/:id',
    component: ViewCourseComponent,
    data: { animation: 'ViewCourse' }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
