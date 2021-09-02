import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginPageComponent } from '../components/pages/login-page/login-page.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseListComponent } from './course-list/course-list.component'
import { AddressComponent } from './address/address.component'
import { EditBillingComponent } from './edit-billing/edit-billing.component'
import { EditShippingComponent } from './edit-shipping/edit-shipping.component'
import { EditAccountComponent } from './edit-account/edit-account.component'
import { ViewCourseComponent } from './course/view-course/view-course.component'
import { DetailComponent } from './course/detail/detail.component'
import { LoginGuard } from '../guards/login.guard'

const routes: Routes = [
  {
    canActivate: [LoginGuard],
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: CourseListComponent
      },
      {
        path: 'edit-address',
        children: [
          {
            path: '',
            component: AddressComponent
          },
          {
            path: 'edit-billing-address',
            component: EditBillingComponent
          },
          {
            path: 'edit-shipping-address',
            component: EditShippingComponent
          }
        ]
      },
      {
        path: 'edit-account',
        component: EditAccountComponent
      }
    ]
  },
  {
    path: 'course-detail/:id',
    component: DetailComponent
  },
  {
    path: 'view-course/:id',
    component: ViewCourseComponent
  },
  { path: 'login', component: LoginPageComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
