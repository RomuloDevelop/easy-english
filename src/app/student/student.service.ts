import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { Observable, zip, Subject } from 'rxjs'
import { finalize, map, mergeMap, take } from 'rxjs/operators'
import { UserAnswer } from 'src/app/state/models'
import {
  StoreUserFinalQuizAnswer,
  UserQuizzService
} from 'src/app/services/user-quizz.service'
import { CourseService } from 'src/app/services/course.service'
import { EnrollmentService } from 'src/app/services/enrollment.service'
import {
  selectActualUser,
  selectUserEnrollment,
  selectUserAnswers,
  selectFinalQuizReminder
} from 'src/app/state/session/session.selectors'
import { setEnrollment } from 'src/app/state/session/profile/session.actions'
import { ROLES } from 'src/data/roles'

export type CourseToShow = ReturnType<StudentService['addLessonCount']>
export type LessonToShow = CourseToShow['sections'][0]['lessons'][0]

@Injectable()
export class StudentService {
  private subHideMenu = new Subject<boolean>()
  hideMenu$ = this.subHideMenu.asObservable()

  constructor(
    private store: Store,
    private userQuizService: UserQuizzService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  hideMenuMesage(hideMenu = false) {
    this.subHideMenu.next(hideMenu)
  }

  getCourseData(
    route: ActivatedRoute,
    refresh = false,
    finalizeCb = () => {}
  ): Observable<CourseToShow> {
    if (refresh) {
      const id = parseInt(route.snapshot.paramMap.get('id'))
      return this.getStoredUser().pipe(
        mergeMap((user) =>
          zip(
            this.enrollmentService.getEnrollments(id),
            this.courseService.getCourse(id),
            this.userQuizService.getUserQuizzes(id, user.id),
            this.userQuizService.getAllUserFinalQuizAnswer(id, user.id)
          ).pipe(
            mergeMap(([enrollments, course]) => {
              const enrollment =
                enrollments.data.find((item) => item.user_id === user.id) ||
                null

              this.store.dispatch(setEnrollment({ enrollment }))

              return this.getStoredCourse(course)
            }),
            finalize(finalizeCb)
          )
        )
      )
    } else {
      return this.getStoredCourse(route).pipe(finalize(finalizeCb))
    }
  }

  addLessonCount(data: any, userAnswers: UserAnswer[], isProspect: boolean) {
    let lastSectionCount = 1
    let lessonsNonBlocked = 0

    const sections = data.sections.map((section) => {
      let lastCount = 0
      const lessons = section.lessons.map((lesson, iLesson) => {
        let blocked = false
        let testOk = false
        let answered = false
        if (isProspect) {
          if (!lesson.is_quiz) lessonsNonBlocked += 1
          else blocked = true
        }

        if (lessonsNonBlocked >= 3) blocked = true

        if (!lesson.is_quiz) {
          lastCount++
        } else {
          const userAnswer = userAnswers.find(
            (item) => item.course_lesson_id === lesson.id
          )
          answered = !!userAnswer
          testOk = userAnswer ? !!userAnswer.is_valid_option : false
        }

        return {
          ...lesson,
          count: lastSectionCount + iLesson,
          countToShow: lastCount,
          testOk,
          answered,
          blocked
        }
      })
      if (lessons.length) lastSectionCount = lessons[lessons.length - 1].count
      return { ...section, lessons }
    })
    const result = { ...data, sections }
    return result
  }

  insertUserQuizzes(data: Omit<UserAnswer, 'user_id'>, finalizeCb = () => {}) {
    return this.getStoredUser().pipe(
      mergeMap((user) =>
        this.userQuizService.createUserAnswer({ user_id: user.id, ...data })
      ),
      finalize(finalizeCb)
    )
  }

  insertUserFinalQuizzes(
    data: Omit<StoreUserFinalQuizAnswer, 'user_id'>[],
    finalizeCb = () => {}
  ) {
    return this.getStoredUser().pipe(
      mergeMap((user) => {
        const requests = data.map((item) =>
          this.userQuizService.createUserFinalQuizAnswer({
            user_id: user.id,
            ...item
          })
        )
        return zip(...requests)
      }),
      finalize(finalizeCb)
    )
  }

  getUserQuizzes() {
    return this.store.pipe(take(1), select(selectUserAnswers))
  }

  private getStoredCourse(course: any) {
    return zip(this.getUserQuizzes(), this.getStoredUser()).pipe(
      map(([userAnswers, user]) =>
        this.addLessonCount(course, userAnswers, user.role === ROLES.PROSPECT)
      )
    )
  }

  updateLastLessonCompleted(lesson: number, finalizeCb) {
    return this.store.pipe(select(selectUserEnrollment), take(1)).pipe(
      mergeMap(({ id }) =>
        this.enrollmentService.updateEnrollment(id, {
          last_lesson_id: lesson
        })
      ),
      map(({ data }) => {
        this.store.dispatch(setEnrollment({ enrollment: data }))
      }),
      finalize(finalizeCb)
    )
  }

  private getStoredUser() {
    return this.store.pipe(select(selectActualUser), take(1))
  }

  getEnrollment() {
    return this.store.pipe(select(selectUserEnrollment))
  }

  showFinalQuizReminder() {
    return this.store.select(selectFinalQuizReminder)
  }
}
