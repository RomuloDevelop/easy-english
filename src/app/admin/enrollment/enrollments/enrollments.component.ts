import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { CourseService } from '../../../services/course.service'
import { SectionService } from '../../../services/section.service'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../../state/admin/admin.selectores'
import { setCourses } from '../../../state/admin/courses/course.actions'
import { PrimeNGConfig, Message } from 'primeng/api'

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss']
})
export class EnrollmentsComponent implements OnInit {
  loadingCourses = false
  loadingSection = null
  msgs: Message[] = []

  itemsPerPage = 10
  showPagination = false
  courseCols = ['Id', 'Title', 'Subtitle', 'Students', 'Status']
  courseRows = ['id', 'title', 'subtitle', 'students_count', 'status']

  courses: CoursesTableRow[]

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private store: Store,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.getTable()
    this.store.pipe(select(selectCoursesTable)).subscribe((data) => {
      this.courses = data
      this.showPagination = this.courses.length > this.itemsPerPage
    })
  }

  getTable() {
    this.loadingCourses = true
    this.courseService
      .getCourses(() => (this.loadingCourses = false))
      .subscribe(
        (courses) => {
          this.store.dispatch(setCourses({ courses }))
        },
        (err) => {
          console.error(err)
        }
      )
  }

  editCourse(course: CoursesTableRow) {
    this._router.navigate(['edit', course.id], {
      relativeTo: this.route
    })
  }
}
