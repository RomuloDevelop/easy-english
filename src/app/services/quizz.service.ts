import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map, mergeMap, take } from 'rxjs/operators'
import { select, Store } from '@ngrx/store'
import { Quiz, QuizOption } from '../state/models'
import { selectCourses } from '../state/admin/admin.selectores'
import { updateFinalQuiz } from '../state/admin/courses/course.actions'
import Endpoints from '../../data/endpoints'

interface FoundedAnswer extends QuizOption {
  founded?: boolean
}

const { lessonUrl, quizzesUrl, answersUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class QuizzService {
  constructor(private http: HttpClient, private store: Store) {}

  getQuizzes() {
    return this.http
      .get<{ data: Quiz[] }>(`course_quizzes`)
      .pipe(map(({ data }) => data))
  }

  getQuizzesByLesson(id: number) {
    return this.http
      .get<{ data: Quiz[] }>(`${lessonUrl}/${id}/course_quizzes`)
      .pipe(map(({ data }) => data))
  }

  addQuiz(quiz: Omit<Quiz, 'course_id' | 'correctAnswer' | 'options'>) {
    return this.http
      .post<{ data: Quiz }>(quizzesUrl, quiz)
      .pipe(map(({ data }) => data))
  }

  updateQuiz(quiz: Omit<Quiz, 'course_id' | 'correctAnswer' | 'options'>) {
    return this.http
      .put<{ data: Quiz }>(`${quizzesUrl}/${quiz.id}`, quiz)
      .pipe(map(({ data }) => data))
  }

  // Solo para examen final
  deleteQuiz(quiz: Quiz) {
    return this.http.delete(`${quizzesUrl}/${quiz.id}`).pipe(
      mergeMap(() =>
        this.store.pipe(
          take(1),
          select(selectCourses),
          map((courses) => {
            const course = courses.find((item) => item.id === quiz.course_id)
            const quizFiltered = course.final_quiz.filter(
              (item) => item.quiz.id !== quiz.id
            )
            this.store.dispatch(
              updateFinalQuiz({
                id: course.id,
                final_quiz: quizFiltered
              })
            )
          })
        )
      )
    )
  }

  getAnswers() {
    return this.http
      .get<{ data: QuizOption[] }>(answersUrl)
      .pipe(map(({ data }) => data))
  }

  addAnswer(option: QuizOption, quiz_id: number) {
    const { id, ...optionFields } = option
    return this.http
      .post<{ data: QuizOption }>(answersUrl, { ...optionFields, quiz_id })
      .pipe(map(({ data }) => data))
  }

  updateAnswer(option: QuizOption, quiz_id: number) {
    const { id, ...optionFields } = option
    return this.http
      .put<{ data: QuizOption }>(`${answersUrl}/${option.id}`, {
        ...optionFields,
        quiz_id
      })
      .pipe(map(({ data }) => data))
  }

  deleteAnswer(answer: QuizOption) {
    return this.http.delete(`${answersUrl}/${answer.id}`)
  }

  addOrUpdateAnswer(
    newList: QuizOption[],
    options: QuizOption[],
    quiz_id: number
  ) {
    const withoutChange: QuizOption[] = []
    let results: Observable<QuizOption>[] = []
    let deletes: Observable<Object>[] = []

    let forUpdates: QuizOption[] = []
    const forDelete = []
    options.forEach((answer) => {
      //Search for updates
      const foundedAnswer = newList.find(
        (actualAnswer) => actualAnswer.id === answer.id
      )
      const newAnswer = foundedAnswer != null ? { ...foundedAnswer } : null
      if (newAnswer?.id === answer.id) {
        if (
          newAnswer.is_valid !== answer.is_valid ||
          newAnswer.description !== answer.description
        ) {
          forUpdates.push(newAnswer)
        } else {
          withoutChange.push(newAnswer)
        }
      } else {
        //Search for deletes
        forDelete.push(answer)
      }
    })

    deletes = forDelete.map((item) => this.deleteAnswer(item))

    let inserts = []
    //Search for inserts
    if (options.length <= 0) {
      inserts = newList.map((answer) => this.addAnswer(answer, quiz_id))
    } else {
      const founded = withoutChange.concat(forUpdates)
      newList.forEach((answer) => {
        if (
          founded.find((item) => item.id === answer.id) == null &&
          forDelete.find((item) => item.id === answer.id) == null
        ) {
          inserts.push(this.addAnswer(answer, quiz_id))
        }
      })
    }

    results = forUpdates
      .map((item) => this.updateAnswer(item, quiz_id))
      .concat(inserts)
    return { results, deletes, withoutChange }
  }
}
