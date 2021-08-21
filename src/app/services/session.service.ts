import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import Endpoints from '../../data/endpoints'
import { catchError, finalize, map } from 'rxjs/operators'
import { InterceptorError } from '../interceptors/commonOptions'
import { throwError } from 'rxjs'

const { loginUrl, logoutUrl } = Endpoints

export interface Login {
  email: string
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private http: HttpClient, private router: Router) {}

  login(data: Login, finalizeCb = () => {}) {
    return this.http
      .post<{ access_token: string; token_type: string }>(loginUrl, data)
      .pipe(
        map((data) => {
          localStorage.setItem('token', data.access_token)
        }),
        catchError((error: InterceptorError) => {
          let message = error.defaultMessage
          if (error.status === 401) {
            message = 'Correo o contraseña inconrrectos'
          }
          return throwError(message)
        }),
        finalize(finalizeCb)
      )
  }

  logout(finalizeCb = () => {}) {
    return this.http.get(logoutUrl).pipe(
      map(() => {
        localStorage.removeItem('token')
        this.router.navigate(['/'], {
          replaceUrl: true
        })
      }),
      catchError((error: InterceptorError) => {
        let message = error.defaultMessage
        return throwError(message)
      }),
      finalize(finalizeCb)
    )
  }
}
