import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService, SectionAction } from '../../admin.service'
import { Store, select } from '@ngrx/store'
import { Course, Section } from '../../../state/admin/models'
import { updateCourse } from '../../../state/admin/courses/course.actions'
import {
  selectCoursesTable,
  CoursesTableRow,
  selectSectionsData,
  SectionData
} from '../../../state/admin/admin.selectores'
import { PrimeNGConfig, MessageService } from 'primeng/api'
import memoize from '../../../decorators/memoize'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
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
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectCoursesTable)).subscribe((resp) => {
      this.course = resp.find((item) => item.id === this.courseId)
      this.title = this.course.title
      this.subtitle = this.course.subtitle
      this.description = this.course.detail
    })
    this.adminService.sectionToEdit$.subscribe((id) => {
      const item = this.sections.find((item) => item.id === id)
      this.disableAdd = item != null
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
}
