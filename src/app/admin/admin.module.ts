import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './admin.component'
import { CoursesComponent } from './course/courses/courses.component'
import { CreateCourseComponent } from './course/create-course/create-course.component'
import { SectionsComponent } from './course/create-course/create-section/sections/sections.component'
import { HeaderComponent } from './header/header.component'

import { SharedModule } from '../shared.module'

import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { EditorModule } from 'primeng/editor'
import { CardModule } from 'primeng/card'
import { DialogModule } from 'primeng/dialog'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { RadioButtonModule } from 'primeng/radiobutton'
import { InputSwitchModule } from 'primeng/inputswitch'
import { ToastModule } from 'primeng/toast'
import { TooltipModule } from 'primeng/tooltip'
import { FileUploadModule } from 'primeng/fileupload'
import { SidebarModule } from 'primeng/sidebar'
import { AvatarModule } from 'primeng/avatar'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { MenuModule } from 'primeng/menu'
import { PanelMenuModule } from 'primeng/panelmenu'
import { DropdownModule } from 'primeng/dropdown'
import { MultiSelectModule } from 'primeng/multiselect'
import { InputNumberModule } from 'primeng/inputnumber'
import { BadgeModule } from 'primeng/badge'

import { ConfirmationService, MessageService } from 'primeng/api'
import { AdminService } from './admin.service'
import { HomePageComponent } from './course/create-course/home-page/home-page.component'
import { CreateSectionComponent } from './course/create-course/create-section/create-section.component'
import { FinalQuizComponent } from './course/create-course/final-quiz/final-quiz.component'
import { UsersComponent } from './user/users/users.component'
import { CreateUserComponent } from './user/create-user/create-user.component'
import { EnrollmentsComponent } from './enrollment/enrollments/enrollments.component'
import { CreateEnrollmentComponent } from './enrollment/create-enrollment/create-enrollment.component'
import { PaymentsComponent } from './payment/payments/payments.component'
import { CreatePaymentComponent } from './payment/create-payment/create-payment.component'
import { TipsComponent } from './tips/tips.component'
import { UserQuizzesComponent } from './course/user-quizzes/user-quizzes.component'
import { CertificateComponent } from '../components/common/certificate/certificate.component'
import { UserNoPaymentComponent } from './payment/user-no-payment/user-no-payment.component'
import { UserPaymentComponent } from './payment/user-payment/user-payment.component'
import { SidenavComponent } from '../admin/sidenav/sidenav.component'
import { UserPaymentStatusComponent } from './payment/user-payment-status/user-payment-status.component'
import { UserStatusComponent } from './payment/user-payment-status/user-status'

@NgModule({
  declarations: [
    AdminComponent,
    CoursesComponent,
    CreateCourseComponent,
    SectionsComponent,
    HeaderComponent,
    HomePageComponent,
    CreateSectionComponent,
    FinalQuizComponent,
    UsersComponent,
    CreateUserComponent,
    EnrollmentsComponent,
    CreateEnrollmentComponent,
    PaymentsComponent,
    CreatePaymentComponent,
    TipsComponent,
    UserQuizzesComponent,
    CertificateComponent,
    UserNoPaymentComponent,
    UserPaymentComponent,
    SidenavComponent,
    UserPaymentStatusComponent,
    UserStatusComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    EditorModule,
    CardModule,
    DialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    InputSwitchModule,
    ToastModule,
    TooltipModule,
    FileUploadModule,
    SidebarModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    PanelMenuModule,
    DropdownModule,
    MultiSelectModule,
    InputNumberModule,
    BadgeModule
  ],
  providers: [AdminService, ConfirmationService, MessageService]
})
export class AdminModule {}
