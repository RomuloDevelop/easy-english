import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../shared.module'

import { StudentRoutingModule } from './student-routing.module'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseListComponent } from './course-list/course-list.component'
import { AddressComponent } from './address/address.component'
import { EditBillingComponent } from './edit-billing/edit-billing.component'
import { EditShippingComponent } from './edit-shipping/edit-shipping.component'
import { EditAccountComponent } from './edit-account/edit-account.component'
import { ViewCourseComponent } from './course/view-course/view-course.component'
import { VideoLessonComponent } from './course/view-course/video-lesson/video-lesson.component'
import { ArticleLessonComponent } from './course/view-course/article-lesson/article-lesson.component'
import { QuizComponent } from './course/view-course/quiz/quiz.component'
import { DetailComponent } from './course/detail/detail.component'

@NgModule({
  declarations: [
    DashboardComponent,
    CourseListComponent,
    AddressComponent,
    EditBillingComponent,
    EditShippingComponent,
    EditAccountComponent,
    ViewCourseComponent,
    VideoLessonComponent,
    ArticleLessonComponent,
    QuizComponent,
    DetailComponent
  ],
  imports: [CommonModule, SharedModule, StudentRoutingModule]
})
export class StudentModule {}
