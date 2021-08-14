import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, from, zip } from 'rxjs'
import { finalize, map, mergeMap, toArray } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { Course } from '../state/models'
import {
  addCourse,
  setCourses,
  updateCourse
} from '../state/admin/courses/course.actions'
import { SectionService } from './section.service'
import { LessonService } from './lesson.service'
import { QuizzService } from './quizz.service'
import Endpoints from '../../data/endpoints'
import { setLectures } from '../state/admin/lectures/lecture.actions'
import { setSections } from '../state/admin/sections/section.actions'
import { DataTransform } from '../utils/DataTransform'

const { courseUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private http: HttpClient,
    private sectionService: SectionService,
    private lessonService: LessonService,
    private quizzService: QuizzService,
    private store: Store
  ) {}

  addCourse(course: Course): Observable<any> {
    return this.http.post(courseUrl, course).pipe(
      map((response: { data: Course }) => {
        const { data } = response
        this.store.dispatch(addCourse({ course: data }))
        return response.data
      })
    )
  }

  getCourses(finalizeCb = () => {}) {
    return this.http.get<{ data: Course[] }>(`${courseUrl}`).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }

  getCourse(id: number, finalizeCb = () => {}) {
    return this.http.get<{ data: any }>(`${courseUrl}/${id}`).pipe(
      map(({ data: course }) => {
        const { sections, final_quizz } = course
        let lessons = []

        // Obtiene curso final
        let formatedCourse = course
        const quizResponse = final_quizz.map((quiz) => ({
          ...quiz,
          answers: quiz.quizz_options
        }))
        if (quizResponse) {
          const finalQuiz = DataTransform.formatFinalQuiz(quizResponse)
          formatedCourse = { ...course, quiz: finalQuiz }
        }

        // Formatea lesson
        sections?.forEach((section) => {
          const formatedLessons = section.lessons.map((lesson) => {
            const quiz = lesson.quizz
            if (quiz != null) {
              quiz[0].answers = quiz[0].quizz_options
              quiz[0].lesson_id = lesson.id
              return DataTransform.backendToAppData(lesson, quiz[0])
            }
            return DataTransform.backendToAppData(lesson, null)
          })
          lessons = lessons.concat(formatedLessons)
        })

        delete formatedCourse.sections
        delete formatedCourse.quizz
        delete sections.lessons
        this.store.dispatch(setCourses({ courses: [formatedCourse] }))
        this.store.dispatch(setSections({ sections: sections }))
        this.store.dispatch(setLectures({ lectures: lessons }))
      }),
      finalize(finalizeCb)
    )
  }

  updateCourse(
    course: Partial<Course>,
    finalCb?: () => void
  ): Observable<{ data: Course }> {
    return this.http
      .patch<{ data: Course }>(`${courseUrl}/${course.id}`, course)
      .pipe(
        map((course) => {
          this.store.dispatch(updateCourse({ course: course.data }))
          return course
        }),
        finalize(finalCb)
      )
  }
}
