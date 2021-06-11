import { Component, OnInit } from '@angular/core'
import { CourseService } from '../course.service'
import { CoursesTableRow } from '../../../state/admin/admin.selectores'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [CourseService]
})
export class DetailComponent implements OnInit {
  course: CoursesTableRow = null

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourseData().subscribe((data) => (this.course = data))
  }
}
