import { Component, OnInit } from '@angular/core'
import { CourseService } from '../../services/course.service'
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {
  loadingCourse: boolean
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadingCourse = true
    this.courseService
      .getCourse(this.courseId, () => (this.loadingCourse = false))
      .subscribe()
  }
}
