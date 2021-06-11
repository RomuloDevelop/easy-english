import { Component, OnInit } from '@angular/core'
import { CourseService } from '../course.service'
import { CoursesTableRow } from '../../../state/admin/admin.selectores'
import { Lecture } from 'src/app/state/admin/models'

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss'],
  providers: [CourseService]
})
export class ViewCourseComponent implements OnInit {
  constructor(private courseService: CourseService) {}
  course: CoursesTableRow = null
  arrayTest = new Array(50)
  actualLesson: Lecture = null
  sectionPanel = true
  ngOnInit(): void {
    this.courseService.getCourseData().subscribe((data) => (this.course = data))
  }

  getLecture(lesson) {
    this.actualLesson = lesson
  }

  toggleSectionPanel() {
    this.sectionPanel = !this.sectionPanel
  }
}
