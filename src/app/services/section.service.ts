import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, from, zip } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'
import { Store, select } from '@ngrx/store'
import { Section } from '../state/models'
import {
  addSection,
  updateSection,
  deleteSection
} from '../state/admin/sections/section.actions'
import Endpoints from '../../data/endpoints'
import { deleteSectionLecture } from '../state/admin/lectures/lecture.actions'

const { courseUrl, sectionUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  constructor(private http: HttpClient, private store: Store) {}

  getSections() {
    return this.http
      .get<{ data: Section[] }>(sectionUrl)
      .pipe(map(({ data }) => data))
  }

  getSectionsByCourse(courseId: number) {
    return this.http
      .get<{ data: Section[] }>(`${courseUrl}/${courseId}/sections`)
      .pipe(map(({ data }) => data))
  }

  addSection(section: Omit<Section, 'id'>) {
    return this.http.post<{ data: Section }>(sectionUrl, section).pipe(
      map(({ data }) => {
        this.store.dispatch(addSection({ section: data }))
        return data
      })
    )
  }

  updateSection(section: Section) {
    return this.http
      .patch<{ data: Section }>(`${sectionUrl}/${section.id}`, section)
      .pipe(
        map(({ data }) => {
          this.store.dispatch(updateSection({ section: data }))
          return data
        })
      )
  }

  deleteSection(section: Section) {
    return this.http.delete(`${sectionUrl}/${section.id}`).pipe(
      map((data) => {
        this.deleteSectionAndLectures(section)
        return data
      })
    )
  }

  deleteSectionAndLectures(section: Section) {
    this.store.dispatch(deleteSectionLecture({ sectionId: section.id }))
    this.store.dispatch(deleteSection({ id: section.id }))
  }
}
