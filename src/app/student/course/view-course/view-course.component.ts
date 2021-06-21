import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CourseService } from '../course.service'
import { CoursesTableRow } from '../../../state/admin/admin.selectores'
import { Lecture, Section } from 'src/app/state/admin/models'

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})
export class ViewCourseComponent implements OnInit {
  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}
  course: CoursesTableRow = null
  actualLesson: Lecture = null
  sectionPanel = true
  ngOnInit(): void {
    this.courseService.hideMenu$.subscribe((hideMenu) => {
      this.sectionPanel = hideMenu
    })
    this.courseService.getCourseData(this.route).subscribe((data) => {
      this.course = data
      this.actualLesson = data.sections[0].lectures[0]
      console.log(this.actualLesson)
    })
  }

  getLecture(lesson) {
    this.actualLesson = lesson
  }

  toggleSectionPanel() {
    this.courseService.hideMenuMesage(!this.sectionPanel)
  }
}
