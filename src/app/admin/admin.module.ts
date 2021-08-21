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
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputSwitchModule } from 'primeng/inputswitch'
import { ToastModule } from 'primeng/toast'
import { TooltipModule } from 'primeng/tooltip'
import { FileUploadModule } from 'primeng/fileupload'
import { SidebarModule } from 'primeng/sidebar'
import { AvatarModule } from 'primeng/avatar'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { MenuModule } from 'primeng/menu'
import { PanelMenuModule } from 'primeng/panelmenu'
import { CalendarModule } from 'primeng/calendar'
import { DropdownModule } from 'primeng/dropdown'

import { ConfirmationService, MessageService } from 'primeng/api'
import { AdminService } from './admin.service'
import { HomePageComponent } from './course/create-course/home-page/home-page.component'
import { CreateSectionComponent } from './course/create-course/create-section/create-section.component'
import { FinalQuizComponent } from './course/create-course/final-quiz/final-quiz.component'
import { UsersComponent } from './user/users/users.component'
import { CreateUserComponent } from './user/create-user/create-user.component'
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
    CreateUserComponent
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
    InputTextareaModule,
    InputSwitchModule,
    ToastModule,
    TooltipModule,
    FileUploadModule,
    SidebarModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    PanelMenuModule,
    CalendarModule,
    DropdownModule
  ],
  providers: [AdminService, ConfirmationService, MessageService]
})
export class AdminModule {}
