import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService, SectionAction } from '../../admin.service'
import { Store, select } from '@ngrx/store'
import { Section } from '../../../state/admin/models'
import {
  deleteSection,
  setSection,
  updateSection
} from '../../../state/admin/sections/section.actions'
import {
  selectCoursesTable,
  CoursesTableRow,
  selectSectionsData,
  SectionData
} from '../../../state/admin/admin.selectores'
import { PrimeNGConfig } from 'primeng/api'
import { combineLatest } from 'rxjs'
import { deleteSectionLecture } from 'src/app/state/admin/lectures/lecture.actions'

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.scss']
})
export class CreateSectionComponent implements OnInit {
  disableAdd = null
  nextSectionId: number = null
  sections: SectionData[] = []
  course: CoursesTableRow = null
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))

  constructor(
    public adminService: AdminService,
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
      this.sections = sections.filter((item) => item.courseId === this.courseId)
      this.nextSectionId = this.getLastId(sections)
      console.log(this.sections)
    })
    this.adminService.sectionToEdit$.subscribe((id) => {
      const item = this.sections.find((item) => item.id === id)
      this.disableAdd = item != null
      console.log(item, this.disableAdd)
    })
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
