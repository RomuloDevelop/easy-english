import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginPageComponent } from '../pages/login-page/login-page.component'
import { AdminComponent } from './admin.component'
import { CoursesComponent } from './course/courses/courses.component'
import { CreateCourseComponent } from './course/create-course/create-course.component'
import { CreateUserComponent } from './user/create-user/create-user.component'
import { UsersComponent } from './user/users/users.component'
import { EnrollmentsComponent } from './enrollment/enrollments/enrollments.component'
import { CreateEnrollmentComponent } from './enrollment/create-enrollment/create-enrollment.component'
import { PaymentsComponent } from './payment/payments/payments.component'
import { CreatePaymentComponent } from './payment/create-payment/create-payment.component'
import { TipsComponent } from './tips/tips.component'
import { UserQuizzesComponent } from './course/user-quizzes/user-quizzes.component'
import { UserNoPaymentComponent } from './payment/user-no-payment/user-no-payment.component'
import { UserPaymentComponent } from './payment/user-payment/user-payment.component'

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: CoursesComponent,
            data: { animation: 'Courses' }
          },
          {
            path: 'create-course/:id',
            component: CreateCourseComponent,
            data: { animation: 'Course' }
          },
          {
            path: 'quizzes/:id',
            component: UserQuizzesComponent,
            data: { animation: 'Quizzes', role: 2 }
          }
        ]
      },
      {
        path: 'students',
        data: { animation: 'Student', role: 2 },
        children: [
          {
            path: '',
            component: UsersComponent,
            data: { animation: 'Students', role: 2 }
          },
          {
            path: 'create',
            component: CreateUserComponent,
            data: { animation: 'CreateStudents', role: 2 }
          },
          {
            path: 'edit/:id',
            component: CreateUserComponent,
            data: { animation: 'EditStudents', role: 2 }
          }
        ]
      },
      {
        path: 'teachers',
        data: { animation: 'Teacher', role: 3 },
        children: [
          {
            path: '',
            component: UsersComponent,
            data: { animation: 'Teachers', role: 3 }
          },
          {
            path: 'create',
            component: CreateUserComponent,
            data: { animation: 'CreateTeacher', role: 3 }
          },
          {
            path: 'edit/:id',
            component: CreateUserComponent,
            data: { animation: 'EditTeacher', role: 3 }
          }
        ]
      },
      {
        path: 'payments',
        data: { animation: 'Payment' },
        children: [
          {
            path: '',
            component: PaymentsComponent,
            data: { animation: 'Payments' }
          },
          {
            path: 'create',
            component: CreatePaymentComponent,
            data: { animation: 'CreatePayment' }
          },
          {
            path: 'edit/:id',
            component: CreatePaymentComponent,
            data: { animation: 'EditPayment' }
          },
          {
            path: 'users-without-payment',
            component: UserNoPaymentComponent,
            data: { animation: 'UsersWithoutPayment' }
          },
          {
            path: 'users-with-payment',
            component: UserPaymentComponent,
            data: { animation: 'UsersWithPayment' }
          }
        ]
      },
      {
        path: 'enrollments',
        data: { animation: 'Enrollment' },
        children: [
          {
            path: '',
            component: EnrollmentsComponent,
            data: { animation: 'Enrollments' }
          },
          {
            path: 'edit/:id',
            component: CreateEnrollmentComponent,
            data: { animation: 'CreateEnrollment' }
          }
        ]
      },
      {
        path: 'tips',
        component: TipsComponent,
        data: { animation: 'Tips' }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
