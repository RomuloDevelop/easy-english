import { Component, Input, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../../state/admin/admin.selectores'
import { CourseService } from '../../../services/course.service'
import { setCourses } from '../../../state/admin/courses/course.actions'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  loadingCourses = false
  courseCols = ['Id', 'Title', 'Subtitle', 'Sections', 'Actions']

  list: Observable<CoursesTableRow[]>

  constructor(
    private store: Store,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getTable()
    this.list = this.store.pipe(
      select(selectCoursesTable),
      map((data) => data.filter((item) => item.status))
    )
  }

  getTable() {
    this.loadingCourses = true
    this.courseService
      .getStudentCourses(() => (this.loadingCourses = false))

      .subscribe(
        (courses) => {
          this.store.dispatch(setCourses({ courses }))
        },
        (err) => {
          console.error(err)
        }
      )
  }

  toCourse(id: number) {
    this.router.navigate(['view-course', id], {
      relativeTo: this.route
    })
  }
}
