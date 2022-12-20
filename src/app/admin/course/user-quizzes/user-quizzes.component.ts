import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { CourseService } from '../../../services/course.service'
import { Lesson, Quiz, User } from '../../../state/models'
import {
  CoursesTableRow,
  selectCourses
} from '../../../state/admin/admin.selectores'
import { PrimeNGConfig, Message } from 'primeng/api'
import { combineLatest, zip } from 'rxjs'
import { selectActualUser } from 'src/app/state/session/session.selectors'
import { UserQuizzService } from 'src/app/services/user-quizz.service'
import { EnrollmentService } from 'src/app/services/enrollment.service'
import { CertificateComponent } from 'src/app/components/common/certificate/certificate.component'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-user-quizzes',
  templateUrl: './user-quizzes.component.html',
  styleUrls: ['./user-quizzes.component.scss']
})
export class UserQuizzesComponent implements OnInit {
  @ViewChild(CertificateComponent) certificate: CertificateComponent
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))
  loadingTable = false
  loadingSubtable = null
  msgs: Message[] = []

  userCols = ['Id', 'Name', 'Email', 'Phone', 'Enrollment Date']
  userRows = ['id', 'name', 'email', 'phone', 'enrollmentDateFormated']

  quizCols = ['Id', 'Title', 'Answer', 'Result']
  quizRows = ['id', 'title', 'option', 'result']

  finalQuizCols = [...this.quizCols, 'Required']
  finalQuizRows = [...this.quizRows, 'required']

  lessons: Lesson[] = []
  usersEnrolled: User[] = []

  actualUser: User

  constructor(
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private store: Store,
    private courseService: CourseService,
    private userQuizService: UserQuizzService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectActualUser)).subscribe((actualUser) => {
      this.actualUser = actualUser
      this.getTable()
    })
  }

  getTable() {
    this.loadingTable = true
    combineLatest([
      this.courseService.getCourse(this.courseId),
      this.enrollmentService.getUsersEnrolled(this.courseId)
    ])
      .subscribe(
        ([course, users]) => {
          this.lessons = course.lessons
          this.usersEnrolled = users
        },
        (err) => {
          console.error(err)
        }
      )
      .add(() => (this.loadingTable = false))
  }

  getQuizzesFromUser(user: any) {
    this.loadingSubtable = user.id
    zip(
      this.userQuizService.getUserQuizzes(this.courseId, user.user_id),
      this.userQuizService.getUserFinalQuizAnswer(this.courseId, user.user_id)
    )
      .subscribe(
        ([userQuizzes, userCourseQuiz]) => {
          const answers = []
          userQuizzes.forEach((answer: any) => {
            const quiz = this.lessons.find(
              (lesson) => answer.course_lesson_id === lesson.id
            )

            const option = (quiz.data as Quiz).options.find(
              (option) => option.id === answer.quiz_option_id
            )

            quiz &&
              answers.push({
                ...answer,
                id: quiz.id,
                title: quiz.title,
                option: option.description,
                result: answer.is_valid_option ? 'Correct' : 'Incorrect'
              })
          })

          user.answers = answers
          user.finalAnswers = (userCourseQuiz as any).map((item) => {
            const { course_quiz } = item
            const option = course_quiz.quiz.options.find(
              (option) => option.id === item.quiz_option_id
            )
            return {
              is_valid_option: item.is_valid_option,
              id: course_quiz.quiz.id,
              title: course_quiz.quiz.title,
              option: option.description,
              result: item.is_valid_option ? 'Correct' : 'Incorrect',
              required: course_quiz.required ? 'Yes' : 'No'
            }
          })
        },
        (err) => {
          console.error(err)
        }
      )
      .add(() => (this.loadingSubtable = null))
  }

  downloadCertificate(user: User) {
    this.store.pipe(take(1), select(selectCourses)).subscribe((courses) => {
      const course = courses.find((item) => item.id === this.courseId)
      this.certificate.getDocument(course.title, course.id, user.name)
    })
  }
}
