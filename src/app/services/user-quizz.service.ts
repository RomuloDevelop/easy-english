import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { UserAnswer, UserFinalQuizAnswer } from '../state/models'
import { Store } from '@ngrx/store'
import {
  addUserAnswer,
  setUserAnswers,
  setUserFinalQuizAnswers,
  addUserFinalQuizAnswer
} from '../state/session/profile/session.actions'

export interface StoreUserFinalQuizAnswer {
  course_quiz_id: number
  user_id: number
  quiz_option_id: number
  is_valid_option: boolean
}

const quizEndpoint = 'course_lesson_user'
const lessonQuizEndpoint = 'get_lesson_quiz_results_by_course_id'
const finalQuizEndpoint = 'course_quiz_user'
const finalQuizEndpointWithFilters = 'get_final_quiz_answer_by_user_and_course'

@Injectable({
  providedIn: 'root'
})
export class UserQuizzService {
  constructor(private http: HttpClient, private store: Store) {}

  getUserQuizzes(course_id?: number, user_id?: number) {
    let params = new HttpParams()

    course_id != null && (params = params.append('course_id', course_id))
    user_id != null && (params = params.append('lesson_id', user_id))

    return this.http
      .get<{ id: number; course_lesson_user: UserAnswer[] }[]>(
        lessonQuizEndpoint,
        {
          params
        }
      )
      .pipe(
        map((data) => {
          const userAnswers = data.map((item) => item.course_lesson_user[0])
          this.store.dispatch(setUserAnswers({ userAnswers: userAnswers }))
          return userAnswers
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

  getUserFinalQuizAnswer(course_id?: number, user_id?: number) {
    let params = new HttpParams()

    user_id != null && (params = params.append('user_id', user_id))
    course_id != null && (params = params.append('course_id', course_id))

    return this.http.get<UserFinalQuizAnswer[]>(finalQuizEndpointWithFilters, {
      params
    })
  }

  getAllUserFinalQuizAnswer(user_id?: number, course_quiz_id?: number) {
    let params = new HttpParams()

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

  createUserFinalQuizAnswer(data: StoreUserFinalQuizAnswer) {
    return this.http
      .post<{ data: UserFinalQuizAnswer }>(finalQuizEndpoint, data)
      .pipe(
        map(({ data }) => {
          this.store.dispatch(
            addUserFinalQuizAnswer({ userFinalQuizAnswer: data })
          )
          return data
        })
      )
  }
}
