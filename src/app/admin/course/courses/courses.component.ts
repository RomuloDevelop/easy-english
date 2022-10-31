import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { CourseService } from '../../../services/course.service'
import { SectionService } from '../../../services/section.service'
import { Course, User } from '../../../state/models'
import {
  selectCoursesTable,
  CoursesTableRow,
  selectSections
} from '../../../state/admin/admin.selectores'
import {
  deleteCourse,
  setCourses
} from '../../../state/admin/courses/course.actions'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import {
  addSection,
  deleteCourseSection,
  updateSection
} from 'src/app/state/admin/sections/section.actions'
import { deleteSectionLesson } from 'src/app/state/admin/lessons/lesson.actions'
import { combineLatest, zip } from 'rxjs'
import { take } from 'rxjs/operators'
import { selectActualUser } from 'src/app/state/session/session.selectors'
import memoize from 'src/app/decorators/memoize'

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  loadingCourses = false
  loadingSection = null
  msgs: Message[] = []

  courseCols = ['Id', 'Title', 'Subtitle', 'Sections']
  courseRows = ['id', 'title', 'subtitle', 'sections']

  sectionCols = ['Id', 'Title', 'Description', 'Lessons']
  sectionRows = ['id', 'title', 'subtitle', 'lessons_count']

  courses: CoursesTableRow[]
  actualUser: User

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private store: Store,
    private courseService: CourseService,
    private sectionService: SectionService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectActualUser)).subscribe((actualUser) => {
      this.actualUser = actualUser
      this.getTable()
    })
    this.store.pipe(select(selectCoursesTable)).subscribe((courses) => {
      this.courses = courses
    })
  }

  getTable() {
    this.loadingCourses = true
    this.courseService
      .getCourses(() => (this.loadingCourses = false))
      .subscribe(
        (courses) => {
          this.store.dispatch(
            setCourses({
              courses: courses.filter((course) =>
                this.actualUser.role === 3
                  ? course.user_id === this.actualUser.id
                  : true
              )
            })
          )
        },
        (err) => {
          console.error(err)
        }
      )
  }

  getSectionItem(courseId: number) {
    this.loadingSection = courseId
    this.courseService
    zip(
      this.sectionService.getSectionsByCourse(
        courseId,
        () => (this.loadingSection = null)
      ),
      this.store.pipe(take(1), select(selectSections))
    ).subscribe(([response, sections]) => {
      response.forEach((item) => {
        if (sections.find((section) => section.id === item.id))
          this.store.dispatch(updateSection({ section: item }))
        else this.store.dispatch(addSection({ section: item }))
      })
    })
  }

  toCreatePage() {
    const newCourse: Course = {
      title: 'Temporal title',
      subtitle: 'Temporal subtitle',
      description: 'Temporal detail',
      status: false,
      level: 'Easy',
      user_id: this.actualUser.id,
      students_count: 0
    }
    this.courseService.addCourse(newCourse).subscribe((course: Course) =>
      this._router.navigate(['create-course', course.id], {
        relativeTo: this.route
      })
    )
  }

  changeStatus(e, course: CoursesTableRow) {
    const { id } = course
    this.courseService.updateCourse({ id, status: e.checked }).subscribe()
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
      this.store.dispatch(deleteSectionLesson({ sectionId: section.id }))
    }
    this.store.dispatch(deleteCourseSection({ courseId: course.id }))
    this.store.dispatch(deleteCourse({ id: course.id }))
  }
}
