import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginPageComponent } from '../pages/login-page/login-page.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseListComponent } from './dashboard/course-list/course-list.component'
import { AddressComponent } from './address/address.component'
import { EditBillingComponent } from './dashboard/edit-billing/edit-billing.component'
import { EditShippingComponent } from './dashboard/edit-shipping/edit-shipping.component'
import { EditAccountComponent } from './dashboard/edit-account/edit-account.component'
import { ViewCourseComponent } from './course/view-course/view-course.component'
import { DetailComponent } from './course/detail/detail.component'
import { LoginGuard } from '../guards/login.guard'

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
