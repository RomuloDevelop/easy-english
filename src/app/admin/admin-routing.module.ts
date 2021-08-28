import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginPageComponent } from '../components/pages/login-page/login-page.component'
import { AdminComponent } from './admin.component'
import { CoursesComponent } from './course/courses/courses.component'
import { CreateCourseComponent } from './course/create-course/create-course.component'
import { CreateSectionComponent } from './course/create-course/create-section/create-section.component'
import { HomePageComponent } from './course/create-course/home-page/home-page.component'
import { CreateUserComponent } from './user/create-user/create-user.component'
import { UsersComponent } from './user/users/users.component'
import { LoginGuard } from '../guards/login.guard'
import { EnrollmentsComponent } from './enrollment/enrollments/enrollments.component'
import { CreateEnrollmentComponent } from './enrollment/create-enrollment/create-enrollment.component'
import { PaymentsComponent } from './payment/payments/payments.component'
import { CreatePaymentComponent } from './payment/create-payment/create-payment.component'

const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuard],
    component: AdminComponent,
    children: [
      {
        path: '',
        component: CoursesComponent
      },
      {
        path: 'create-course/:id',
        component: CreateCourseComponent,
        children: [
          {
            path: 'home-page',
            component: HomePageComponent
          },
          {
            path: 'create-section',
            component: CreateSectionComponent
          }
        ]
      },
      {
        path: 'users/:role',
        children: [
          {
            path: '',
            component: UsersComponent
          },
          {
            path: 'create',
            component: CreateUserComponent
          },
          {
            path: 'edit/:id',
            component: CreateUserComponent
          }
        ]
      },
      {
        path: 'payments',
        children: [
          {
            path: '',
            component: PaymentsComponent
          },
          {
            path: 'create',
            component: CreatePaymentComponent
          },
          {
            path: 'edit/:id',
            component: CreatePaymentComponent
          }
        ]
      },
      {
        path: 'enrollments',
        children: [
          {
            path: '',
            component: EnrollmentsComponent
          },
          {
            path: 'edit/:id',
            component: CreateEnrollmentComponent
          }
        ]
      }
    ]
  },
  { path: 'login', component: LoginPageComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
