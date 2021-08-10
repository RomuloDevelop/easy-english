import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService, SectionAction } from '../../admin.service'
import { Store, select } from '@ngrx/store'
import { SectionService } from '../../../services/section.service'
import { Section } from '../../../state/models'
import {
  selectCoursesTable,
  CoursesTableRow,
  selectSectionsData,
  SectionData
} from '../../../state/admin/admin.selectores'
import { PrimeNGConfig } from 'primeng/api'
import { combineLatest, Observable } from 'rxjs'
import { deleteSectionLecture } from 'src/app/state/admin/lectures/lecture.actions'
import { deleteSection } from 'src/app/state/admin/sections/section.actions'

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.scss']
})
export class CreateSectionComponent implements OnInit {
  disableAdd = null
  sections: SectionData[] = []
  course: CoursesTableRow = null
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))

  constructor(
    public adminService: AdminService,
    private sectionService: SectionService,
    private store: Store,
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    combineLatest([
      this.store.pipe(select(selectCoursesTable)),
      this.store.pipe(select(selectSectionsData))
    ]).subscribe((resp) => {
      const [courses, sections] = resp
      this.course = courses.find((item) => item.id === this.courseId)
      this.sections = sections.filter(
        (item) => item.course_id === this.courseId
      )
    })
    this.adminService.sectionToEdit$.subscribe((id) => {
      const item = this.sections.find((item) => item.id === id)
      this.disableAdd = item != null
    })
  }

  addSection() {
    const section: Omit<Section, 'id'> = {
      course_id: this.courseId,
      title: 'Temporal title',
      subtitle: 'Temporal subtitle'
    }
    this.sectionService.addSection(section).subscribe((data) => {
      this.adminService.nextMessage(data.id)
    })
  }

  updateSection(item: { section: Section; type: SectionAction }) {
    const { section: newSection, type } = item
    if (type === 'delete') {
      this.deleteSectionAndLectures(newSection)
      //this.sectionService.addSection(newSection)
    } else if (type === 'update') {
      this.sectionService
        .updateSection(newSection)
        .subscribe(() => this.adminService.nextMessage(null))
    } else if (type === 'cancel') {
      this.adminService.nextMessage(null)
    }
  }

  deleteSectionAndLectures(section: Section) {
    this.store.dispatch(deleteSectionLecture({ sectionId: section.id }))
    this.store.dispatch(deleteSection({ id: section.id }))
  }
}
