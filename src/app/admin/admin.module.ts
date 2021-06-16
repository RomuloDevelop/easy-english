import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './admin.component'
import { CoursesComponent } from './courses/courses.component'
import { CreateCourseComponent } from './create-course/create-course.component'
import { SectionsComponent } from './create-course/create-section/sections/sections.component'
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

import { ConfirmationService, MessageService } from 'primeng/api'
import { AdminService } from './admin.service'
import { HomePageComponent } from './create-course/home-page/home-page.component'
import { CreateSectionComponent } from './create-course/create-section/create-section.component';
import { FinalQuizComponent } from './create-course/final-quiz/final-quiz.component'
@NgModule({
  declarations: [
    AdminComponent,
    CoursesComponent,
    CreateCourseComponent,
    SectionsComponent,
    HeaderComponent,
    HomePageComponent,
    CreateSectionComponent,
    FinalQuizComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    FormsModule,
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
    PanelMenuModule
  ],
  providers: [AdminService, ConfirmationService, MessageService]
})
export class AdminModule {}
