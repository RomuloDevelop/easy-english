import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, finalize, map, mergeMap } from 'rxjs/operators'
import Endpoints from '../../data/endpoints'
import { of, throwError, zip } from 'rxjs'
import { UserService } from './user.service'
import { User } from '../state/models'
import * as moment from 'moment'

const { enrollmentUrl, courseUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  constructor(private http: HttpClient, private userService: UserService) {}

  getUsersEnrolled(course_id: number, finalizeCb = () => {}) {
    return this.http
      .get<{ data: any }>(`${courseUrl}/${course_id}/enrollments`)
      .pipe(
        mergeMap(({ data }) => {
          if (data.length) {
            const requests = []
            data.forEach((item) => {
              const request = this.userService.getUser(item.user_id)
              requests.push(request)
            })
            return zip(...requests).pipe(
              map((responses) => this.getUsersById(responses, data))
            )
          } else {
            return of(data)
          }
        }),
        finalize(finalizeCb)
      )
  }

  getUsersNotEnrolled(course_id: number, finalizeCb = () => {}) {
    return this.http
      .get<{ data: any }>(
        `${courseUrl}/${course_id}/students_without_enrollment`
      )
      .pipe(
        map(({ data }) => data),
        finalize(finalizeCb)
      )
  }

  insertEnrollments(course_id: number, users: User[], finalizeCb = () => {}) {
    const users_id = users.map((item) => item.id)
    return this.http
      .post<{ data: any }>(`${courseUrl}/${course_id}/${enrollmentUrl}`, {
        course_id,
        users_id
      })
      .pipe(
        map(({ data }) => this.getUsersById(users, data)),
        finalize(finalizeCb)
      )
  }

  deleteUser(id: number, finalizeCb = () => {}) {
    return this.http.delete(`${enrollmentUrl}/${id}`).pipe(finalize(finalizeCb))
  }

  getUsersById(responses, data) {
    return data.map((item) => {
      const result: User = responses.find(
        (response: any) => response.id === item.user_id
      ) as User | null
      delete result?.id
      return {
        ...item,
        ...result,
        enrollmentDateFormated: moment(item.enrollment_date).format(
          'DD/MM/YYYY'
        )
      }
    })
  }
}
