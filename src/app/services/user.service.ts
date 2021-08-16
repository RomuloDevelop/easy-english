import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { finalize, map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import Endpoints from '../../data/endpoints'
import { User } from '../state/models'
import {
  addUser,
  deleteUser,
  setUsers,
  updateUser
} from '../state/admin/users/user.actions'

const { usersUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private store: Store) {}

  getUser(id: number, finalizeCb = () => {}) {
    return this.http
      .get<{ data: any }>(`${usersUrl}/${id}`)
      .pipe(map(({ data }) => data))
  }

  getUsers(finalizeCb = () => {}) {
    return this.http.get<{ data: User[] }>(usersUrl).pipe(
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
      finalize(finalizeCb)
    )
  }

  updateUser(user: Partial<User>, finalizeCb = () => {}) {
    return this.http.put<{ data: User }>(`${usersUrl}/${user.id}`, user).pipe(
      map(({ data: user }) => {
        this.store.dispatch(updateUser({ user }))
      }),
      finalize(finalizeCb)
    )
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
