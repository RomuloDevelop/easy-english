import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'

import { Course } from '../../../../state/admin/models'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../../../state/admin/admin.selectores'
import {
  setCourse,
  updateStatus,
  deleteCourse
} from '../../../../state/admin/courses/course.actions'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import { deleteCourseSection } from 'src/app/state/admin/sections/section.actions'
import { deleteSectionLecture } from 'src/app/state/admin/lectures/lecture.actions'

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  msgs: Message[] = []

  courseCols = ['Id', 'Title', 'Subtitle', 'Sections', 'Status']
  sectionCols = ['Id', 'Title', 'Description', 'Lectures']

  courseRows = []
  sectionRows = []
  courses: CoursesTableRow[]
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private store: Store
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    const rename = (col) => col.toLowerCase()
    this.courseRows = this.courseCols.map(rename)
    this.sectionRows = this.sectionCols.map(rename)
    this.store.pipe(select(selectCoursesTable)).subscribe((data) => {
      this.courses = data
    })
  }

  toCreatePage() {
    const [lastCourse] = this.courses.slice(-1)
    const id = lastCourse != null ? lastCourse.id + 1 : 1
    const newCourse: Course = {
      title: 'Temporal title',
      subtitle: 'Temporal subtitle',
      detail: 'Temporal detail',
      status: false,
      id
    }
    this.store.dispatch(setCourse({ course: newCourse }))
    this._router.navigate(['create-course', id], { relativeTo: this.route })
  }

  editCourse(course: CoursesTableRow) {
    this._router.navigate(['create-course', course.id], {
      relativeTo: this.route
    })
  }

  changeStatus(e, course: CoursesTableRow) {
    const { id } = course
    this.store.dispatch(updateStatus({ id, status: e.checked }))
  }

  confirmDeleteCourse(course: CoursesTableRow) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.msgs = [
          { severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }
        ]
        this.deleteAllCourseData(course)
      },
      reject: () => {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'You have rejected' }
        ]
        console.error(this.msgs)
      }
    })
  }

  deleteAllCourseData(course: CoursesTableRow) {
    for (let section of course.sections) {
      this.store.dispatch(deleteSectionLecture({ sectionId: section.id }))
    }
    this.store.dispatch(deleteCourseSection({ courseId: course.id }))
    this.store.dispatch(deleteCourse({ id: course.id }))
  }
}
