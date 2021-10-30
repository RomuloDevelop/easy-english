import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, finalize, map, mergeMap } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { InterceptorError } from '../interceptors/commonOptions'
import Endpoints from '../../data/endpoints'
import { User } from '../state/models'
import { Observable, of, throwError, zip } from 'rxjs'
import { UserService } from './user.service'
import * as moment from 'moment'

export interface Payment {
  id?: number
  description: string
  date: string
  status: number
  user_id: number
}

const { paymentUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  constructor(private http: HttpClient, private userService: UserService) {}

  getPayment(id: number, finalizeCb = () => {}) {
    return this.http.get<{ data: Payment }>(`${paymentUrl}/${id}`).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }

  getPayments(finalizeCb = () => {}) {
    return this.http.get<{ data: Payment[] }>(paymentUrl).pipe(
      mergeMap(({ data }) => {
        if (data.length) {
          const requests: Observable<User>[] = []
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

  insertPayment(payment: Payment, finalizeCb = () => {}) {
    return this.http
      .post<{ data: Payment }>(paymentUrl, { ...payment, percentaje: 1 })
      .pipe(
        map(({ data }) => data),
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

  updatePayment(payment: Partial<Payment>, finalizeCb = () => {}) {
    const { id } = payment
    delete payment.id
    return this.http
      .patch<{ data: Payment }>(`${paymentUrl}/${id}`, payment)
      .pipe(
        map(({ data }) => data),
        finalize(finalizeCb)
      )
  }

  deletePayment(id: number, finalizeCb = () => {}) {
    return this.http.delete(`${paymentUrl}/${id}`).pipe(finalize(finalizeCb))
  }

  getUsersById(responses: User[], data: Payment[]) {
    return data.map((item) => {
      const result: User = responses.find(
        (response: any) => response.id === item.user_id
      )
      delete result?.id
      return {
        ...item,
        ...result,
        dateFormated: moment(item.date).format('DD/MM/YYYY')
      }
    })
  }
}
