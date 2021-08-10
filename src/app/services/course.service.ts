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

  getCourses() {
    return this.http
      .get<{ data: Course[] }>(`${courseUrl}`)
      .pipe(map(({ data }) => data))
  }

  getCourse(id: number) {
    return this.http
      .get<{ data: Course }>(`${courseUrl}/${id}`)
      .pipe(map(({ data }) => data))
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

  getCourseData(id: number) {
    return this.getCourse(id).pipe(
      mergeMap((course) =>
        this.sectionService.getSectionsByCourse(course.id).pipe(
          mergeMap((sections) =>
            from(sections).pipe(
              mergeMap((section: any) =>
                this.lessonService.getLessonsBySection(section.id).pipe(
                  map(({ data: lessons }) => {
                    return { section, lessons }
                  }),
                  mergeMap((courseData) =>
                    from(courseData.lessons).pipe(
                      mergeMap((lesson: any) =>
                        this.quizzService.getQuizzesByLesson(lesson.id).pipe(
                          map((quizzes) => {
                            courseData.lessons = courseData.lessons.map(
                              (item) => {
                                if (item.id === lesson.id) {
                                  item.quizzes = quizzes
                                }
                                return item
                              }
                            )
                          })
                        )
                      ),
                      toArray(),
                      map(() => courseData)
                    )
                  )
                )
              ),
              toArray()
            )
          )
        )
      )
    )
  }

  getCourseList() {
    zip(
      this.getCourses(),
      this.sectionService.getSections(),
      this.lessonService.getLessons(),
      this.quizzService.getQuizzes(),
      this.quizzService.getAnswers()
    ).subscribe(([courses, sections, lessons, quizzes, answers]) => {
      const formatedCourses = courses.map((course) => {
        const quizResponse = quizzes
          .filter(
            (quizz) => quizz.is_final_quiz && quizz.course_id === course.id
          )
          .map((quizz) => {
            const quizz_answers = answers.filter(
              (answer) => answer.course_quiz_id === quizz.id
            )
            return { ...quizz, answers: quizz_answers }
          })
        const quiz = DataTransform.formatFinalQuiz(quizResponse)
        return { ...course, quiz }
      })
      console.log('lessons', lessons)
      const formatedLessons = lessons.map((lesson) => {
        const quizz = quizzes.find((quizz) => quizz.lesson_id === lesson.id)
        if (quizz) {
          const quizz_answers = answers.filter(
            (answer) => answer.course_quiz_id === quizz.id
          )
          quizz.answers = quizz_answers
        }
        return DataTransform.backendToAppData(lesson, quizz)
      })
      this.store.dispatch(setLectures({ lectures: formatedLessons }))
      this.store.dispatch(setSections({ sections }))
      this.store.dispatch(setCourses({ courses: formatedCourses }))
    })
  }
}
