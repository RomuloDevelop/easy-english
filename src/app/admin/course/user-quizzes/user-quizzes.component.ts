import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { CourseService } from '../../../services/course.service'
import { SectionService } from '../../../services/section.service'
import { Course, Lesson, Quiz, User, UserAnswer } from '../../../state/models'
import {
  selectCoursesTable,
  CoursesTableRow,
  selectSections
} from '../../../state/admin/admin.selectores'
import {
  deleteCourse,
  setCourses
} from '../../../state/admin/courses/course.actions'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import {
  addSection,
  deleteCourseSection,
  updateSection
} from 'src/app/state/admin/sections/section.actions'
import { deleteSectionLesson } from 'src/app/state/admin/lessons/lesson.actions'
import { combineLatest, zip } from 'rxjs'
import { take } from 'rxjs/operators'
import { selectActualUser } from 'src/app/state/session/session.selectors'
import memoize from 'src/app/decorators/memoize'
import { UserQuizzService } from 'src/app/services/user-quizz.service'
import { EnrollmentService } from 'src/app/services/enrollment.service'

interface UserQuizzes extends User {
  answers?: Lesson[]
}

@Component({
  selector: 'app-user-quizzes',
  templateUrl: './user-quizzes.component.html',
  styleUrls: ['./user-quizzes.component.scss']
})
export class UserQuizzesComponent implements OnInit {
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))
  loadingTable = false
  loadingSubtable = null
  msgs: Message[] = []

  userCols = ['Id', 'Name', 'Email', 'Phone', 'Enrollment Date']
  userRows = ['id', 'name', 'email', 'phone', 'enrollmentDateFormated']

  quizCols = ['Id', 'Title', 'Answer', 'Result']
  quizRows = ['id', 'title', 'option', 'result']

  lessons: Lesson[] = []
  usersEnrolled: User[] = []

  actualUser: User

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
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
    ]).subscribe(([course, users]) => {
      this.lessons = course.lessons
      this.usersEnrolled = users
    })
  }

  getQuizzesFromUser(user: any) {
    this.loadingSubtable = user.id
    zip(
      this.userQuizService.getUserQuizzes(this.courseId, user.user_id),
      this.userQuizService.getUserFinalQuizAnswer(this.courseId, user.user_id)
    ).subscribe(([userQuizzes, userCourseQuiz]) => {
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
          result: item.is_valid_option ? 'Correct' : 'Incorrect'
        }
      })

      this.loadingSubtable = null
    })
  }

  approveUser(user: CoursesTableRow) {}
}
