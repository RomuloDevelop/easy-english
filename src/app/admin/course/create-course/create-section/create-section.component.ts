import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService, SectionAction } from '../../../admin.service'
import { Store, select } from '@ngrx/store'
import { SectionService } from '../../../../services/section.service'
import { Section } from '../../../../state/models'
import {
  selectCoursesTable,
  CoursesTableRow,
  selectSectionsData,
  SectionData
} from '../../../../state/admin/admin.selectores'
import { PrimeNGConfig } from 'primeng/api'

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.scss']
})
export class CreateSectionComponent implements OnInit {
  loading = false
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
    this.store.pipe(select(selectCoursesTable)).subscribe((courses) => {
      this.store.pipe(select(selectSectionsData)).subscribe((sections) => {
        this.course = courses.find((item) => item.id === this.courseId)
        this.sections = sections.filter(
          (item) => item.course_id === this.courseId
        )
      })
    })
    this.adminService.sectionToEdit$.subscribe((id) => {
      const item = this.sections.find((item) => item.id === id)
      this.disableAdd = item != null
    })
  }

  addSection() {
    this.loading = true
    const section: Omit<Section, 'id'> = {
      course_id: this.courseId,
      title: 'Temporal title',
      subtitle: 'Temporal subtitle'
    }
    this.sectionService.addSection(section).subscribe((data) => {
      this.loading = false
      this.adminService.nextMessage(data.id)
    })
  }

  updateSection(item: { section: Section; type: SectionAction }) {
    this.loading = true
    const { section: newSection, type } = item
    if (type === 'delete') {
      this.sectionService.deleteSection(newSection).subscribe(() => {
        this.loading = false
      })
    } else if (type === 'update') {
      this.sectionService.updateSection(newSection).subscribe(() => {
        this.loading = false
        this.adminService.nextMessage(null)
      })
    } else if (type === 'cancel') {
      this.adminService.nextMessage(null)
    }
  }
}
