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
    return this.http.get<{ data: Course[] }>(`my_courses`).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }

  getCourse(
    id: number,
    finalizeCb = () => {}
  ): Observable<{
    course: Course
    sections: Section[]
    lessons: Lecture[]
  }> {
    return this.http.get<{ data: any }>(`${courseUrl}/${id}`).pipe(
      map(({ data: course }) => {
        const { sections, final_quiz } = course
        let lessons = []

        // Formatea lesson
        sections?.forEach((section) => {
          const formatedLessons = section.lessons.map((lesson) => {
            if (lesson.is_quiz) {
              console.log('is quiz', lesson)
              const { quiz } = lesson
              quiz.answers = quiz.options
              quiz.lesson_id = lesson.id
              quiz.course_id = course.id
              return DataTransform.backendToAppData(lesson, quiz)
            }
            return DataTransform.backendToAppData(lesson, null)
          })
          lessons = lessons.concat(formatedLessons)
        })

        delete course.sections
        delete sections.lessons
        this.store.dispatch(setCourses({ courses: [course] }))
        this.store.dispatch(setSections({ sections: sections }))
        this.store.dispatch(setLectures({ lectures: lessons }))
        return { course, sections, lessons }
      }),
      finalize(finalizeCb)
    )
  }

  updateCourse(course: Partial<Course>, finalCb?: () => void) {
    return this.http
      .patch<{ data: Course }>(`${courseUrl}/${course.id}`, course)
      .pipe(
        map(() => {
          this.store.dispatch(updateCourse({ course }))
        }),
        finalize(finalCb)
      )
  }
}
