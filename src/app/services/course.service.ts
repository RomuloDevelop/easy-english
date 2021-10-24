import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { finalize, map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { Course, Lecture, Section } from '../state/models'
import {
  addCourse,
  setCourses,
  updateCourse
} from '../state/admin/courses/course.actions'
import Endpoints from '../../data/endpoints'
import { setLectures } from '../state/admin/lectures/lecture.actions'
import { setSections } from '../state/admin/sections/section.actions'
import { DataTransform } from '../utils/DataTransform'

const { courseUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient, private store: Store) {}

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

  getStudentCourses(finalizeCb = () => {}) {
    return this.http.get<{ data: Course[] }>(`${courseUrl}`).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }

  getCourse(
    id: number,
    finalizeCb = () => {}
  ): Observable<{
    courses: Course[]
    sections: Section[]
    lessons: Lecture[]
  }> {
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
          finalQuiz.questions = finalQuiz.questions.map((item) => ({
            ...item,
            course_id: course.id
          }))
          formatedCourse = { ...course, quiz: finalQuiz }
        }

        // Formatea lesson
        sections?.forEach((section) => {
          const formatedLessons = section.lessons.map((lesson) => {
            const quiz = lesson.quizz
            if (quiz != null) {
              quiz[0].answers = quiz[0].quizz_options
              quiz[0].lesson_id = lesson.id
              quiz[0].course_id = course.id
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
        return { courses: formatedCourse, sections, lessons }
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
