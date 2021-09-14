import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, finalize, map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { InterceptorError } from '../interceptors/commonOptions'
import Endpoints from '../../data/endpoints'
import { User } from '../state/models'
import {
  addUser,
  deleteUser,
  setUsers,
  updateUser
} from '../state/admin/users/user.actions'
import { throwError } from 'rxjs'
import { setActualUser } from '../state/session/profile/session.actions'

const { usersUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private store: Store) {}

  getUser(id: number, finalizeCb = () => {}) {
    return this.http.get<{ data: User }>(`${usersUrl}/${id}`).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }

  getActualUser(finalizeCb = () => {}) {
    return this.http.get<User>('user').pipe(
      map((data) => {
        this.store.dispatch(setActualUser({ user: data }))
        return data
      }),
      finalize(finalizeCb)
    )
  }

  getUsers(role?: number, finalizeCb = () => {}) {
    let params = ''
    if (role != null) {
      params = `?role=${role}`
    }
    return this.http.get<{ data: User[] }>(usersUrl + params).pipe(
      map(({ data: users }) => {
        this.store.dispatch(setUsers({ users }))
        return users
      }),
      finalize(finalizeCb)
    )
  }

  insertUser(user: User, finalizeCb = () => {}) {
    return this.http.post<{ data: User }>(usersUrl, user).pipe(
      map(({ data: user }) => {
        this.store.dispatch(addUser({ user }))
      }),
      catchError((error: InterceptorError) => {
        let message = error.defaultMessage
        if (error.error?.errors) {
          const errorField = Object.keys(error.error.errors)[0]
          message = error.error.errors[errorField][0]
        }
        return throwError(message)
      }),
      finalize(finalizeCb)
    )
  }

  updateUser(user: Partial<User>, finalizeCb = () => {}) {
    const { id } = user
    delete user.id
    return this.http.patch<{ data: User }>(`${usersUrl}/${id}`, user).pipe(
      map(({ data: user }) => {
        this.store.dispatch(updateUser({ user }))
      }),
      finalize(finalizeCb)
    )
  }

  updatePassword(id: number, password: string, finalizeCb = () => {}) {
    return this.http
      .put(`${usersUrl}/${id}/update_password`, { password })
      .pipe(finalize(finalizeCb))
  }

  deleteUser(id: number, finalizeCb = () => {}) {
    return this.http.delete(`${usersUrl}/${id}`).pipe(
      map(() => {
        this.store.dispatch(deleteUser({ id }))
      }),
      finalize(finalizeCb)
    )
  }
}
