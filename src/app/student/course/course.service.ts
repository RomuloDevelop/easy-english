import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../state/admin/admin.selectores'

export type CourseToShow = ReturnType<CourseService['addLessonCount']>
export type LessonToShow = CourseToShow['sections'][0]['lectures'][0]

@Injectable()
export class CourseService {
  private subHideMenu = new Subject<boolean>()
  hideMenu$ = this.subHideMenu.asObservable()

  constructor(private store: Store) {}

  hideMenuMesage(hideMenu = false) {
    console.log(hideMenu)

    this.subHideMenu.next(hideMenu)
  }

  getCourseData(route: ActivatedRoute): Observable<CourseToShow> {
    return this.store.pipe(
      select(selectCoursesTable),
      map((data) => this.addLessonCount(data, route))
    )
  }

  addLessonCount(data: CoursesTableRow[], route: ActivatedRoute) {
    const filtered = data.filter((item) => item.status)
    const id = parseInt(route.snapshot.paramMap.get('id'))
    const course = filtered.find((item) => item.id === id)
    const sections = course.sections.map((item) => {
      let lastCount = 0
      let lectures = item.lectures.map((item) => {
        if (item.type !== 'Quiz') {
          lastCount++
        }
        return { ...item, count: lastCount }
      })
      return { ...item, lectures }
    })
    const result = { ...course, sections }
    return result
  }
}
