import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { finalize, map, mergeMap } from 'rxjs/operators'
import Endpoints from '../../data/endpoints'
import { of, zip } from 'rxjs'
import { UserService } from './user.service'
import { User, Enrollment } from '../state/models'
import * as moment from 'moment'

const { enrollmentUrl, courseUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  constructor(private http: HttpClient, private userService: UserService) {}

  getEnrollments(course_id: number) {
    return this.http.get<{ data: Enrollment[] }>(
      `${courseUrl}/${course_id}/enrollments`
    )
  }

  updateEnrollment(id: number, params: Partial<Enrollment>) {
    return this.http.patch<{ data: Enrollment }>(
      `${enrollmentUrl}/${id}`,
      params
    )
  }

  getUsersEnrolled(course_id: number, finalizeCb = () => {}) {
    return this.getEnrollments(course_id).pipe(
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
