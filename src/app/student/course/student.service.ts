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
import {
  selectActualUser,
  selectNotes
} from 'src/app/state/session/session.selectors'

export type CourseToShow = ReturnType<StudentService['addLessonCount']>
export type LessonToShow = CourseToShow['sections'][0]['lectures'][0]

@Injectable()
export class StudentService {
  private subHideMenu = new Subject<boolean>()
  hideMenu$ = this.subHideMenu.asObservable()

  constructor(
    private store: Store,
    private userNotes: UserQuizzService,
    private courseService: CourseService
  ) {}

  hideMenuMesage(hideMenu = false) {
    console.log(hideMenu)

    this.subHideMenu.next(hideMenu)
  }

  getCourseData(route: ActivatedRoute, refresh = false, finalizeCb = () => {}) {
    if (refresh) {
      const id = parseInt(route.snapshot.paramMap.get('id'))
      return zip(this.getStoredUser(), this.courseService.getCourse(id)).pipe(
        mergeMap(([user, data]) => {
          const requests: Observable<UserQuiz[]>[] = []
          data.lessons.forEach((item) => {
            if (item.type === 'Quiz') {
              requests.push(
                this.userNotes.getUserQuizzes((item.data as Quiz).id, user.id)
              )
            }
          })
          return requests.length
            ? zip(...requests).pipe(mergeMap(() => this.getStoredCourse(route)))
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
    const sections = course.sections.map((item) => {
      let lastCount = 0
      let lectures = item.lectures.map((item) => {
        let testOk = false
        let answered = false
        if (item.type !== 'Quiz') {
          lastCount++
        } else {
          const userNote = userQuizzes.find(
            (userNote) => userNote.course_quiz_id === item.id
          )
          answered = !!userNote
          testOk = userNote ? userNote.approved : false
        }
        return { ...item, count: lastCount, testOk, answered }
      })
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

  private getStoredUser() {
    return this.store.pipe(select(selectActualUser), take(1))
  }
}
