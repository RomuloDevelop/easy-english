import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../state/admin/admin.selectores'

@Injectable()
export class CourseService {
  constructor(private store: Store, private route: ActivatedRoute) {}

  getCourseData(): Observable<CoursesTableRow> {
    return this.store.pipe(
      select(selectCoursesTable),
      map((data) => {
        const filtered = data.filter((item) => item.status)
        const id = parseInt(this.route.snapshot.paramMap.get('id'))
        console.log('from service', id)
        const course = filtered.find((item) => item.id === id)
        const sections = course.sections.map((item) => {
          let lastCount = 0
          let lectures = item.lectures.map((item) => {
            if (item.type !== 'Quiz') {
              lastCount++
              return { ...item, count: lastCount }
            }
            return item
          })
          return { ...item, lectures }
        })
        return { ...course, sections }
      })
    )
  }
}
