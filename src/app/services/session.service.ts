import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import Endpoints from '../../data/endpoints'
import { catchError, finalize, map, mergeMap } from 'rxjs/operators'
import { InterceptorError } from '../interceptors/commonOptions'
import { of, throwError } from 'rxjs'
import { UserService } from './user.service'
import roles from '../../data/roles'

const { loginUrl, logoutUrl } = Endpoints

export interface Login {
  email: string
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  login(data: Login, requiredRole: number, finalizeCb = () => {}) {
    return this.http
      .post<{ access_token: string; token_type: string }>(loginUrl, data)
      .pipe(
        map(({ access_token }) => {
          localStorage.setItem('token', access_token)
          return access_token
        }),
        mergeMap((access_token) =>
          this.userService.getActualUser().pipe(
            mergeMap((user) => {
              if (user.role !== requiredRole && user.role !== 1) {
                return this.logout(() => {}, false).pipe(
                  map(() => {
                    let roleName = ''
                    for (let role in roles) {
                      if (roles[role] === requiredRole) {
                        roleName = role.toLowerCase()
                        break
                      }
                    }
                    throw {
                      defaultMessage: `The user is not a${
                        roleName[0] === 'a' ? 'n' : ''
                      } ${roleName}`
                    }
                  })
                )
              }
              return of({ user, access_token })
            })
          )
        ),
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

  logout(finalizeCb = () => {}, redirect = true) {
    return this.http.get(logoutUrl).pipe(
      map(() => {
        localStorage.removeItem('token')
        if (redirect) {
          this.router.navigate(['/'], {
            replaceUrl: true
          })
        }
      }),
      catchError((error: InterceptorError) => {
        let message = error.defaultMessage
        return throwError(message)
      }),
      finalize(finalizeCb)
    )
  }
}
