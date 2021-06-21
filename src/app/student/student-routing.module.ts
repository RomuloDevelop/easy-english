import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseListComponent } from './course-list/course-list.component'
import { AddressComponent } from './address/address.component'
import { EditBillingComponent } from './edit-billing/edit-billing.component'
import { EditShippingComponent } from './edit-shipping/edit-shipping.component'
import { EditAccountComponent } from './edit-account/edit-account.component'
import { ViewCourseComponent } from './course/view-course/view-course.component'
import { DetailComponent } from './course/detail/detail.component'

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
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
