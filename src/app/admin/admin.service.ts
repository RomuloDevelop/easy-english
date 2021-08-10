import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, from, zip } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'
import { Store, select } from '@ngrx/store'
import { Course, Section, Lecture, Quiz, Answer } from '../state/models'
import {
  selectCoursesTable,
  CoursesTableRow
} from '../state/admin/admin.selectores'
import {
  addCourse,
  setCourses,
  updateStatus,
  deleteCourse,
  updateCourse
} from '../state/admin/courses/course.actions'

export type SectionAction = 'update' | 'cancel' | 'delete'

@Injectable()
export class AdminService {
  private subSectionToEdit = new BehaviorSubject<number>(null)
  sectionToEdit$ = this.subSectionToEdit.asObservable()

  constructor(private http: HttpClient, private store: Store) {}

  nextMessage(id: number) {
    this.subSectionToEdit.next(id)
  }
}
