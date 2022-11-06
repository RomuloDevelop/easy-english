import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of, zip } from 'rxjs'
import { map, mergeMap, take, tap } from 'rxjs/operators'
import { select, Store } from '@ngrx/store'
import { Quiz, QuizOption } from '../state/models'
import { selectCourses } from '../state/admin/admin.selectores'
import { updateFinalQuiz } from '../state/admin/courses/course.actions'
import { DataTransform } from '../utils/DataTransform'
import Endpoints from '../../data/endpoints'
import { QuizzService } from './quizz.service'

interface CourseQuiz {
  id?: number
  course_id: number
  quiz_id: number
  required: boolean
}

const { courseQuizzesUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class FinalQuizService {
  constructor(
    private http: HttpClient,
    private store: Store,
    private quizService: QuizzService
  ) {}

  addQuiz(quiz: Quiz, required = false) {
    const { course_id, options, correctAnswer, ...quizFields } = quiz
    return this.quizService.addQuiz(quizFields).pipe(
      mergeMap((quizResp) =>
        this.addCourseQuiz({
          course_id: quiz.course_id,
          quiz_id: quizResp.id,
          required
        }).pipe(
          map((courseQuiz) => {
            courseQuiz.quiz = quizResp
            this.store
              .pipe(take(1), select(selectCourses))
              .subscribe((courses) => {
                const { id, final_quiz } = courses.find(
                  (course) => course.id === quiz.course_id
                )

                this.store.dispatch(
                  updateFinalQuiz({
                    id,
                    final_quiz: [...final_quiz, courseQuiz]
                  })
                )
              })
          })
        )
      )
    )
  }

  updateQuiz(quiz: Quiz, course_quiz_id: number, required = false) {
    const { course_id, options, correctAnswer, ...quizFields } = quiz
    return zip(
      this.updateCourseQuiz({ id: course_quiz_id, required }),
      this.quizService.updateQuiz(quizFields)
    ).pipe(
      mergeMap(([_, data]) =>
        this.store.pipe(
          take(1),
          select(selectCourses),
          mergeMap((courses) => {
            let course = courses.find((item) => item.id === quiz.course_id)
            let final_quiz = course.final_quiz
            let actualQuiz = final_quiz.find((item) => item.quiz.id === quiz.id)
            // Agrega, actualiza y elimina donde corresponda
            const { results, deletes, withoutChange } =
              this.quizService.addOrUpdateAnswer(
                quiz.options || [],
                actualQuiz.quiz.options || [],
                quiz.id
              )
            if (!results?.length && !deletes?.length) {
              return of(data)
            }
            return zip(...results, ...deletes).pipe(
              map((options) => {
                const newOptions = options.filter(
                  (item: QuizOption) => item?.id
                ) as QuizOption[] //Obtiene solo respuestas de insertado y actualizado
                data.options = withoutChange
                  .map((item) =>
                    DataTransform.answerToPost(item, quiz.course_id)
                  )
                  .concat(newOptions)
                  .sort((a, b) => a.id - b.id)
                final_quiz = final_quiz.map((item) =>
                  item.quiz.id === data.id ? { ...item, quiz: data } : item
                )
                this.store.dispatch(
                  updateFinalQuiz({ final_quiz, id: course.id })
                )
                return data
              })
            )
          })
        )
      )
    )
  }

  addCourseQuiz(data: CourseQuiz) {
    return this.http
      .post<{ data: any }>(courseQuizzesUrl, data)
      .pipe(map(({ data }) => data))
  }

  updateCourseQuiz(data: Partial<CourseQuiz>) {
    return this.http
      .patch<{ data: any }>(`${courseQuizzesUrl}/${data.id}`, data)
      .pipe(map(({ data }) => data))
  }
}
