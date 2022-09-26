import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { UserAnswer, UserFinalQuizAnswer } from '../state/models'
import { Store } from '@ngrx/store'
import {
  addUserAnswer,
  setUserAnswers,
  setUserFinalQuizAnswers,
  updateUserFinalQuizAnswers
} from '../state/session/profile/session.actions'

const quizEndpoint = 'course_lesson_user'
const finalQuizEndpoint = 'course_quiz_user'

@Injectable({
  providedIn: 'root'
})
export class UserQuizzService {
  constructor(private http: HttpClient, private store: Store) {}

  getUserQuizzes(course_id?: number, user_id?: number) {
    const params = new HttpParams()

    course_id && params.append('course_id', course_id)
    user_id && params.append('lesson_id', user_id)

    return this.http.get<{ data: UserAnswer[] }>(quizEndpoint, { params }).pipe(
      map(({ data }) => {
        this.store.dispatch(setUserAnswers({ userAnswers: data }))
        return data
      })
    )
  }

  createUserAnswer(data: UserAnswer) {
    return this.http.post<{ data: UserAnswer }>(quizEndpoint, data).pipe(
      map(({ data }) => {
        this.store.dispatch(addUserAnswer({ userAnswer: data }))
        return data
      })
    )
  }

  getUserFinalQuizAnswer(user_id?: number, course_quiz_id?: number) {
    const params = new HttpParams()

    user_id && params.append('user_id', user_id)
    course_quiz_id && params.append('course_quiz_id', course_quiz_id)

    return this.http
      .get<{ data: UserFinalQuizAnswer[] }>(finalQuizEndpoint, { params })
      .pipe(
        map(({ data }) => {
          this.store.dispatch(
            setUserFinalQuizAnswers({ userFinalQuizAnswers: data })
          )
          return data
        })
      )
  }

  createUserFinalQuizAnswer(data: UserFinalQuizAnswer) {
    return this.http
      .post<{ data: UserFinalQuizAnswer }>(finalQuizEndpoint, data)
      .pipe(
        map(({ data }) => {
          this.store.dispatch(
            updateUserFinalQuizAnswers({ userFinalQuizAnswer: data })
          )
          return data
        })
      )
  }
}
