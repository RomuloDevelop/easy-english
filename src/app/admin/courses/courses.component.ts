import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { AdminService } from '../admin.service'
import { CourseService } from '../../services/course.service'
import { Course } from '../../state/models'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../state/admin/admin.selectores'
import {
  updateStatus,
  deleteCourse,
  addCourse
} from '../../state/admin/courses/course.actions'
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
  courseRows = ['id', 'title', 'subtitle', 'sections', 'status']

  sectionCols = ['Id', 'Title', 'Description', 'Lectures']
  sectionRows = ['id', 'title', 'subtitle', 'lectures']

  courses: CoursesTableRow[]

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private store: Store,
    private adminService: AdminService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.courseService.getCourseList()
    this.store.pipe(select(selectCoursesTable)).subscribe((data) => {
      this.courses = data
    })
  }

  toCreatePage() {
    const newCourse: Course = {
      title: 'Temporal title',
      subtitle: 'Temporal subtitle',
      description: 'Temporal detail',
      status: false,
      level: 'Easy',
      user_id: 1,
      students_count: 0
    }
    this.courseService.addCourse(newCourse).subscribe((course: Course) =>
      this._router.navigate(['create-course', course.id], {
        relativeTo: this.route
      })
    )
  }

  editCourse(course: CoursesTableRow) {
    this._router.navigate(['create-course', course.id], {
      relativeTo: this.route
    })
    // this.courseService.getCourseData(course.id).subscribe((response) => {
    //   console.log(response)
    // })
  }

  changeStatus(e, course: CoursesTableRow) {
    const { id } = course
    this.courseService
      .updateCourse({ id, status: e.checked })
      .subscribe((data) => console.log(data))
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
