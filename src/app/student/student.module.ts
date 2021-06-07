import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../shared.module'

import { StudentRoutingModule } from './student-routing.module'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseListComponent } from './course-list/course-list.component'
import { AddressComponent } from './address/address.component'

@NgModule({
  declarations: [DashboardComponent, CourseListComponent, AddressComponent],
  imports: [CommonModule, StudentRoutingModule, SharedModule]
})
export class StudentModule {}
