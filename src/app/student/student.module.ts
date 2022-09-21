import { NgModule } from '@angular/core'
import { SharedModule } from '../shared.module'

import { StudentRoutingModule } from './student-routing.module'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CourseListComponent } from './dashboard/course-list/course-list.component'
import { AddressComponent } from './address/address.component'
import { EditBillingComponent } from './dashboard/edit-billing/edit-billing.component'
import { EditShippingComponent } from './dashboard/edit-shipping/edit-shipping.component'
import { EditAccountComponent } from './dashboard/edit-account/edit-account.component'
import { ViewCourseComponent } from './course/view-course/view-course.component'
import { VideoLessonComponent } from './course/view-course/video-lesson/video-lesson.component'
import { ArticleLessonComponent } from './course/view-course/article-lesson/article-lesson.component'
import { QuizComponent } from './course/view-course/quiz/quiz.component'
import { DetailComponent } from './course/detail/detail.component'
import { AvatarModule } from 'primeng/avatar'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { MenuModule } from 'primeng/menu'
import { PanelMenuModule } from 'primeng/panelmenu'
import { RadioButtonModule } from 'primeng/radiobutton'
import { ToastModule } from 'primeng/toast'

import { HeaderComponent } from './course/header/header.component'
import { FinalQuizComponent } from './course/view-course/final-quiz/final-quiz.component'
import { QuestionComponent } from './course/view-course/question/question.component'

import { StudentService } from './course/student.service'
import { MessageService } from 'primeng/api'
import { TipComponent } from './tip/tip.component'

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
    DetailComponent,
    HeaderComponent,
    FinalQuizComponent,
    QuestionComponent,
    TipComponent
  ],
  imports: [
    SharedModule,
    StudentRoutingModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    PanelMenuModule,
    RadioButtonModule,
    ToastModule
  ],
  providers: [StudentService, MessageService]
})
export class StudentModule {}
