import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { UserQuiz } from '../state/models'
import Endpoints from 'src/data/endpoints'
import { Store } from '@ngrx/store'
import { addUserNote } from '../state/session/profile/session.actions'

const { userQuizzesUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class UserQuizzService {
  constructor(private http: HttpClient, private store: Store) {}

  getUserQuizzes(quiz: number, user: number, store = true) {
    return this.http
      .get<{ data: UserQuiz[] }>(
        `${userQuizzesUrl}?user_id=${user}&course_quiz_id=${quiz}`
      )
      .pipe(map(({ data }) => this.storeResult(data, store)))
  }

  insertUserQuizzes(data: UserQuiz[], store = true) {
    return this.http
      .post<{ data: UserQuiz[] }>('create_user_quizzes_massive', {
        user_quizzes: data
      })
      .pipe(map(({ data }) => this.storeResult(data, store)))
  }

  private storeResult(data: UserQuiz[], store) {
    let result = data.length ? data : []
    if (store) {
      result.forEach((userNote) =>
        this.store.dispatch(addUserNote({ userNote }))
      )
    }
    return result
  }
}
