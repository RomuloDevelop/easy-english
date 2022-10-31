import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { StudentService } from '../../student.service'
import { CoursesTableRow } from '../../../state/admin/admin.selectores'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [StudentService]
})
export class DetailComponent implements OnInit {
  course: CoursesTableRow = null

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.studentService
      .getCourseData(this.route, false)
      .subscribe((data) => (this.course = data))
  }
}
