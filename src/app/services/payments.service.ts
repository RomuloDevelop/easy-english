import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
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
  voucher: string
  payment_date: string
  payment_month: string
  status: number
  user_id: number
}

interface PaymentPaginator {
  data: Payment[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export enum PAYMENT_STATUS {
  PENDING = 1,
  PARTIAL,
  COMPLETE
}

export interface IPaymentStatus {
  id: PAYMENT_STATUS
  description: string
}

export const STATUS_LIST = [
  {
    id: PAYMENT_STATUS.PENDING,
    description: 'Pendiente'
  },
  {
    id: PAYMENT_STATUS.PARTIAL,
    description: 'Pago parcial'
  },
  {
    id: PAYMENT_STATUS.COMPLETE,
    description: 'Pagado'
  }
]

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

  getPayments(page: number = 1, status?: number, user_id?: number) {
    let params = new HttpParams()

    params = params.append('page', page)
    status != null && (params = params.append('status', status))
    user_id != null && (params = params.append('user_id', user_id))

    return this.http.get<PaymentPaginator>(paymentUrl, { params }).pipe(
      mergeMap((paymentPaginator) => {
        if (paymentPaginator.data.length) {
          const requests: Observable<User>[] = []
          paymentPaginator.data.forEach((item) => {
            const request = this.userService.getUser(item.user_id)
            requests.push(request)
          })
          return zip(...requests).pipe(
            map((responses) => ({
              ...paymentPaginator,
              data: this.getUsersById(responses, paymentPaginator.data)
            }))
          )
        } else {
          return of(paymentPaginator)
        }
      })
    )
  }

  insertPayment(payment: Payment, finalizeCb = () => {}) {
    return this.http.post<{ data: Payment }>(paymentUrl, payment).pipe(
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
        dateFormated: moment(item.payment_date).format('DD/MM/YYYY')
      }
    })
  }
}
