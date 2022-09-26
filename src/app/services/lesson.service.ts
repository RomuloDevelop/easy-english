import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, zip } from 'rxjs'
import { map, mergeMap, take } from 'rxjs/operators'
import { select, Store } from '@ngrx/store'
import { Lesson, LessonResponse, Quiz, QuizOption } from '../state/models'
import { QuizzService } from '../services/quizz.service'
import {
  addLesson,
  updateLesson,
  deleteLesson
} from '../state/admin/lessons/lesson.actions'
import { DataTransform } from '../utils/DataTransform'
import Endpoints from '../../data/endpoints'
import { selectLessons } from '../state/admin/admin.selectores'

interface LessonQuiz {
  quiz: { question: string; title: string }
  quiz_options: { description: string; is_valid: 1 | 0 }[]
  course_lesson: LessonResponse
}

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

  addLesson(lesson: Lesson) {
    const formatedLesson = DataTransform.appDataToBackend(lesson)
    return this.http
      .post<{ data: LessonResponse }>(lessonUrl, formatedLesson)
      .pipe(
        map(({ data }) => DataTransform.backendToAppData(data, null)),
        map((lessonFormated) => {
          this.store.dispatch(addLesson({ lesson: lessonFormated }))
          return lessonFormated
        })
      )
  }

  addLessonQuiz(data: LessonQuiz) {
    data.course_lesson.youtube_id = 'null'
    return this.http.post<any>('create_course_lesson_quiz', data).pipe(
      map(({ data: resp }) => {
        const lessonFormated: Lesson = {
          id: resp.id,
          title: resp.title,
          section_id: resp.section_id,
          data: {
            ...resp.quiz,
            answers: resp.options
          },
          is_quiz: true,
          type: 'Quiz'
        }
        this.store.dispatch(addLesson({ lesson: lessonFormated }))
      })
    )
  }

  updateLesson(lesson: Lesson) {
    let updateQuizz$ = (data: LessonResponse) =>
      this.updateLessonQuizz(lesson.data as Quiz, data.id).pipe(
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
          lesson.type === 'Quiz' ? updateQuizz$(data) : onlyFormatQuizz$(data)
        ),
        map((lessonFormated) => {
          this.store.dispatch(updateLesson({ lesson: lessonFormated }))
          return lessonFormated
        })
      )
  }

  deleteLesson(id: number) {
    return this.http.delete(`${lessonUrl}/${id}`).pipe(
      map((data) => {
        this.store.dispatch(deleteLesson({ id }))
        return data
      })
    )
  }

  updateLessonQuizz(quiz: Quiz, lesson_id: number) {
    const { course_id, options, correctAnswer, ...quizFields } = quiz
    return this.quizService.updateQuiz(quizFields).pipe(
      // Comparar answers
      mergeMap((data) =>
        this.store.pipe(
          take(1),
          select(selectLessons),
          mergeMap((lessons) => {
            let actualLesson = lessons.find((item) => item.id === lesson_id)

            // Agrega, actualiza y elimina donde corresponda
            const { results, deletes, withoutChange } =
              this.quizService.addOrUpdateAnswer(
                quiz.options,
                (actualLesson.data as Quiz).options,
                quiz.id
              )
            if (!results?.length && !deletes?.length) {
              data.options = withoutChange.map((item) =>
                DataTransform.answerToPost(item, quiz.course_id)
              )
              return of(data)
            }
            return zip(...results, ...deletes).pipe(
              map((options) => {
                const newAnswers = options.filter(
                  (item: any) => item?.id
                ) as QuizOption[] //Obtiene solo respuestas de insertado y actualizado
                data.options = withoutChange
                  .map((item) =>
                    DataTransform.answerToPost(item, quiz.course_id)
                  )
                  .concat(newAnswers)
                  .sort((a, b) => a.id - b.id)
                const lesson: Lesson = {
                  id: actualLesson.id,
                  title: actualLesson.title,
                  section_id: actualLesson.section_id,
                  type: actualLesson.type,
                  resources: actualLesson.resources,
                  data,
                  is_quiz: actualLesson.is_quiz
                }
                this.store.dispatch(updateLesson({ lesson }))
                return data
              })
            )
          })
        )
      )
    )
  }
}
