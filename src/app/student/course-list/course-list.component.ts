import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../../state/admin/admin.selectores'

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courseCols = ['Id', 'Title', 'Subtitle', 'Sections', 'Actions']

  list: Observable<CoursesTableRow[]>

  constructor(private store: Store) {}

  ngOnInit() {
    this.list = this.store.pipe(
      select(selectCoursesTable),
      map((data) => data.filter((item) => item.status))
    )
  }
}
