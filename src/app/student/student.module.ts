import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../shared.module'

import { StudentRoutingModule } from './student-routing.module'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseComponent } from './course/course.component'
import { CourseListComponent } from './course-list/course-list.component'
import { AddressComponent } from './address/address.component'
import { EditBillingComponent } from './edit-billing/edit-billing.component'
import { EditShippingComponent } from './edit-shipping/edit-shipping.component'
import { EditAccountComponent } from './edit-account/edit-account.component'

@NgModule({
  declarations: [
    DashboardComponent,
    CourseComponent,
    CourseListComponent,
    AddressComponent,
    EditBillingComponent,
    EditShippingComponent,
    EditAccountComponent
  ],
  imports: [CommonModule, SharedModule, StudentRoutingModule]
})
export class StudentModule {}
