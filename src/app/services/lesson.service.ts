import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, iif, of, defer } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { Lecture, Quiz, LessonResponse } from '../state/models'
import { QuizzService } from '../services/quizz.service'
import {
  addLecture,
  updateLecture,
  deleteLecture
} from '../state/admin/lectures/lecture.actions'
import { DataTransform } from '../utils/DataTransform'
import Endpoints from '../../data/endpoints'

const { sectionUrl, lessonUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(
    private http: HttpClient,
    private store: Store,
    private quizService: QuizzService
  ) {}

  getLessons() {
    return this.http
      .get<{ data: LessonResponse[] }>(lessonUrl)
      .pipe(map(({ data }) => data))
  }

  getLessonsBySection(sectionId: number): Observable<any> {
    return this.http
      .get<{ data: LessonResponse[] }>(`${sectionUrl}/${sectionId}/lessons`)
      .pipe(map(({ data }) => data))
  }

  addLesson(lesson: Lecture) {
    let addQuizz$ = (data: LessonResponse) =>
      this.quizService.addQuizz(lesson.data as Quiz, false).pipe(
        map((quiz) => {
          console.log('quiz', quiz)
          return DataTransform.backendToAppData(data, quiz)
        })
      )

    let onlyFormatQuizz$ = (data: LessonResponse) =>
      of(DataTransform.backendToAppData(data, null))

    const formatedLesson = DataTransform.appDataToBackend(lesson)
    return this.http
      .post<{ data: LessonResponse }>(lessonUrl, formatedLesson)
      .pipe(
        mergeMap(({ data }) =>
          iif(
            () => lesson.type === 'Quiz',
            defer(() => addQuizz$(data)),
            defer(() => onlyFormatQuizz$(data))
          )
        ),
        map((lessonFormated) => {
          this.store.dispatch(addLecture({ lecture: lessonFormated }))
          return lessonFormated
        })
      )
  }

  updateLesson(lesson: Lecture) {
    let updateQuizz$ = (data: LessonResponse) =>
      this.quizService.updateQuizz(lesson.data as Quiz, false, data.id).pipe(
        map((quiz) => {
          return DataTransform.backendToAppData(data, quiz)
        })
      )

    let onlyFormatQuizz$ = (data: LessonResponse) =>
      of(DataTransform.backendToAppData(data, null))

    const formatedLesson = DataTransform.appDataToBackend(lesson)
    return this.http
      .put<{ data: LessonResponse }>(
        `${lessonUrl}/${lesson.id}`,
        formatedLesson
      )
      .pipe(
        mergeMap(({ data }) =>
          iif(
            () => lesson.type === 'Quiz',
            defer(() => updateQuizz$(data)),
            defer(() => onlyFormatQuizz$(data))
          )
        ),
        map((lessonFormated) => {
          this.store.dispatch(updateLecture({ lecture: lessonFormated }))
          return lessonFormated
        })
      )
  }

  deleteLesson(id: number) {
    return this.http.delete(`${lessonUrl}/${id}`).pipe(
      map((data) => {
        this.store.dispatch(deleteLecture({ id }))
        return data
      })
    )
  }
}
