import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  selectCoursesTable,
  CoursesTableRow,
  SectionData
} from '../../state/admin/admin.selectores'

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  course: CoursesTableRow = null

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select(selectCoursesTable),
        map((data) => data.filter((item) => item.status))
      )
      .subscribe((data) => {
        const id = parseInt(this.route.snapshot.paramMap.get('id'))
        const course = data.find((item) => item.id === id)
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
        this.course = { ...course, sections }
      })
  }
}
