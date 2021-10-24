import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { Observable, zip, Subject, of, combineLatest } from 'rxjs'
import { finalize, map, mergeMap, take } from 'rxjs/operators'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../state/admin/admin.selectores'
import { Quiz, UserQuiz } from 'src/app/state/models'
import { UserQuizzService } from 'src/app/services/user_quizz.service'
import { CourseService } from 'src/app/services/course.service'
import { EnrollmentService } from 'src/app/services/enrollment.service'
import {
  selectActualUser,
  selectUserEnrollment,
  selectNotes
} from 'src/app/state/session/session.selectors'
import {
  setEnrollment,
  setUserNotes
} from 'src/app/state/session/profile/session.actions'

export type CourseToShow = ReturnType<StudentService['addLessonCount']>
export type LessonToShow = CourseToShow['sections'][0]['lectures'][0]

@Injectable()
export class StudentService {
  private subHideMenu = new Subject<boolean>()
  hideMenu$ = this.subHideMenu.asObservable()

  constructor(
    private store: Store,
    private userNotes: UserQuizzService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  hideMenuMesage(hideMenu = false) {
    console.log(hideMenu)

    this.subHideMenu.next(hideMenu)
  }

  getCourseData(
    route: ActivatedRoute,
    refresh = false,
    finalizeCb = () => {}
  ): Observable<CourseToShow> {
    if (refresh) {
      const id = parseInt(route.snapshot.paramMap.get('id'))
      return zip(
        this.getStoredUser(),
        this.enrollmentService.getEnrollments(id),
        this.courseService.getCourse(id)
      ).pipe(
        mergeMap(([user, enrollments, data]) => {
          const requests: Observable<UserQuiz[]>[] = []
          data.lessons.forEach((item) => {
            if (item.type === 'Quiz') {
              requests.push(
                this.userNotes.getUserQuizzes((item.data as Quiz).id, user.id)
              )
            }
          })
          const enrollment = enrollments.data.find(
            (item) => item.user_id === user.id
          )

          if (enrollment) this.store.dispatch(setEnrollment({ enrollment }))

          return requests.length
            ? zip(...requests).pipe(
                mergeMap((userNotes) => {
                  let flaten: UserQuiz[] = []
                  userNotes.forEach((list) =>
                    list.forEach((item) => flaten.push(item))
                  )
                  this.store.dispatch(setUserNotes({ userNotes: flaten }))
                  return this.getStoredCourse(route)
                })
              )
            : this.getStoredCourse(route)
        }),
        finalize(finalizeCb)
      )
    } else {
      return this.getStoredCourse(route).pipe(finalize(finalizeCb))
    }
  }

  addLessonCount(
    userQuizzes: UserQuiz[],
    data: CoursesTableRow[],
    route: ActivatedRoute
  ) {
    const filtered = data.filter((item) => item.status)
    const id = parseInt(route.snapshot.paramMap.get('id'))
    const course = filtered.find((item) => item.id === id)
    let lastSectionCount = 1
    const sections = course.sections.map((item) => {
      let lastCount = 0
      let lectures = item.lectures.map((item, iLecture) => {
        let testOk = false
        let answered = false
        if (item.type !== 'Quiz') {
          lastCount++
        } else {
          const userNote = userQuizzes.find(
            (userNote) => userNote.course_quiz_id === (item.data as Quiz).id
          )
          console.log(userNote)
          answered = !!userNote
          testOk = userNote ? userNote.approved : false
        }
        return {
          ...item,
          count: lastSectionCount + iLecture,
          countToShow: lastCount,
          testOk,
          answered
        }
      })
      lastSectionCount = lectures[lectures.length - 1].count
      return { ...item, lectures }
    })
    const result = { ...course, sections }
    return result
  }

  insertUserQuizzes(data: Omit<UserQuiz, 'user_id'>[], finalizeCb = () => {}) {
    return this.getStoredUser().pipe(
      mergeMap((user) => {
        const userQuiz = data.map((item) => ({ ...item, user_id: user.id }))
        return this.userNotes.insertUserQuizzes(userQuiz)
      }),
      finalize(finalizeCb)
    )
  }

  getUserQuizzes() {
    return this.store.pipe(select(selectNotes))
  }

  private getStoredCourse(route: ActivatedRoute) {
    return combineLatest([
      this.getUserQuizzes(),
      this.store.pipe(select(selectCoursesTable))
    ]).pipe(
      map(([userNotes, course]) =>
        this.addLessonCount(userNotes, course, route)
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
}
