import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService, SectionAction } from '../admin.service'
import { Store, select } from '@ngrx/store'
import { Course, Section } from '../../state/admin/models'
import { updateCourse } from '../../state/admin/courses/course.actions'
import {
  deleteSection,
  setSection,
  updateSection
} from '../../state/admin/sections/section.actions'
import {
  selectCoursesTable,
  CoursesTableRow,
  selectSectionsData,
  SectionData
} from '../../state/admin/admin.selectores'
import { PrimeNGConfig, MessageService } from 'primeng/api'
import { combineLatest } from 'rxjs'
import memoize from '../../decorators/memoize'
import { deleteSectionLecture } from 'src/app/state/admin/lectures/lecture.actions'

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {
  disableAdd = null
  nextSectionId: number = null
  title = ''
  subtitle = ''
  description = ''
  sections: SectionData[] = []
  course: CoursesTableRow = null
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))

  constructor(
    public adminService: AdminService,
    private store: Store,
    private _router: Router,
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true
    combineLatest([
      this.store.pipe(select(selectCoursesTable)),
      this.store.pipe(select(selectSectionsData))
    ]).subscribe((resp) => {
      const [courses, sections] = resp
      this.course = courses.find((item) => item.id === this.courseId)
      this.sections = sections.filter((item) => item.courseId === this.courseId)
      this.title = this.course.title
      this.subtitle = this.course.subtitle
      this.description = this.course.detail
      this.nextSectionId = this.getLastId(sections)
    })
    this.adminService.sectionToEdit$.subscribe((id) => {
      const item = this.sections.find((item) => item.id === id)
      this.disableAdd = item != null
      console.log(item, this.disableAdd)
    })
  }

  updateCourse() {
    const course: Course = {
      id: this.course.id,
      title: this.title,
      subtitle: this.subtitle,
      detail: this.description,
      status: this.course.status
    }
    this.store.dispatch(updateCourse({ course }))
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'The course has been updated'
    })
  }

  @memoize()
  disableUpdate(title, subtitle, description) {
    return (
      title === '' ||
      subtitle === '' ||
      description === '' ||
      description == null
    )
  }

  addSection() {
    const id = this.nextSectionId
    const section: Section = {
      courseId: this.courseId,
      title: 'Temporal title',
      description: 'Temporal subtitle',
      id
    }
    this.store.dispatch(setSection({ section }))
    this.adminService.nextMessage(id)
  }

  getLastId(sections) {
    let lastId = 1
    if (sections[sections.length - 1]) {
      lastId = sections[sections.length - 1].id + 1
    }
    return lastId
  }

  updateSection(item: { section: Section; type: SectionAction }) {
    const { section: newSection, type } = item
    if (type === 'delete') {
      this.deleteSectionAndLectures(newSection)
    } else if (type === 'update') {
      this.store.dispatch(updateSection({ section: newSection }))
    }
    this.adminService.nextMessage(null)
  }
  deleteSectionAndLectures(section: Section) {
    this.store.dispatch(deleteSectionLecture({ sectionId: section.id }))
    this.store.dispatch(deleteSection({ id: section.id }))
  }
}